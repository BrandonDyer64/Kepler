#include "display/Display.hpp"
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include "linmath.h"
#include <napi.h>
#include <sstream>
#include <string>
#include <iostream>
#include <cmath>

using namespace Napi;

Boolean Test_GlfwInit(const CallbackInfo& info) {
  Env env = info.Env();
  return Boolean::New(env, glfwInit());
}

Boolean Test_GlfwIncluded(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef _glfw3_h_
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

Boolean Test_GladIncluded(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef __glad_h_
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

String GlfwGetVersion(const CallbackInfo& info) {
  Env env = info.Env();
  int major = 0, minor = 0, rev = 0;
  glfwGetVersion(&major, &minor, &rev);
  std::ostringstream str;
  str
    << major << '.'
    << minor << '.'
    << rev;
  return String::New(env, str.str());
}

static const struct
{
    float x, y;
    float r, g, b;
} vertices[3] =
{
    { -0.6f, -0.4f, 1.f, 0.f, 0.f },
    {  0.6f, -0.4f, 0.f, 1.f, 0.f },
    {   0.f,  0.6f, 0.f, 0.f, 1.f }
};
static const char* vertex_shader_text =
R"(
#version 410 core
layout (location = 0) in vec2 a_position;

out vec2 surfacePosition;
uniform vec2 screenRatio;
uniform vec2 resolution;

void main() {
    surfacePosition = a_position * screenRatio;
    gl_Position = vec4(a_position, 0, 1);
}
)";

static const char* fragment_shader_text =
R"(
#version 410 core

in vec2 surfacePosition;

out vec4 color;

uniform float time;
uniform vec2 resolution;
uniform vec4 mouse;


const int MAX_MARCHING_STEPS = 512;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.001;

#define PI 3.1415926535898 // That was from memory, so if things start flying off the screen...

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

float sphereSDF(vec3 samplePoint) {
    return length(vec3(samplePoint.x, samplePoint.y+1.5, samplePoint.z + 5.0));
}
float floorSDF(vec3 samplePoint) {
  return samplePoint.y+1.0;
}
float sceneSDF(vec3 samplePoint) {
    return  opSmoothSubtraction(sphereSDF(samplePoint), floorSDF(samplePoint), 3.0);
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
            return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}



void main() {

    vec3 dir = rayDirection(45.0, resolution.xy, gl_FragCoord.xy);
    vec3 eye = vec3(0.0f, 0.0f, 5.0f);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);

    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        color = vec4(0.0);
        return;
    }

    color = vec4(vec3(1.0 - dist / 20.0), 1.0);
}
)";
static void error_callback(int error, const char* description)
{
    fprintf(stderr, "Error: %s\n", description);
}
static void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
        glfwSetWindowShouldClose(window, GLFW_TRUE);
}
int screenWidth = 1280, screenHeight = 720;

Boolean GlfwTestOpenWindow(const CallbackInfo& info) {
  Env env = info.Env();
  GLFWwindow* window;
  GLuint vertex_buffer, vertex_shader, fragment_shader, program;
  GLint mvp_location, vpos_location, vcol_location;
  glfwSetErrorCallback(error_callback);
  if (!glfwInit())
      exit(EXIT_FAILURE);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);
  glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  glfwWindowHint(GLFW_SAMPLES, 4);
  window = glfwCreateWindow(screenWidth, screenHeight, "Kepler Engine Window Test", NULL, NULL);
  if (!window)
  {
      glfwTerminate();
      exit(EXIT_FAILURE);
  }
  glfwSetKeyCallback(window, key_callback);
  glfwMakeContextCurrent(window);
  gladLoadGL();
  glfwSwapInterval(1);
  glEnable(GL_MULTISAMPLE);
  // NOTE: OpenGL error checks have been omitted for brevity
  glGenBuffers(1, &vertex_buffer);
  glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
  vertex_shader = glCreateShader(GL_VERTEX_SHADER);
  glShaderSource(vertex_shader, 1, &vertex_shader_text, NULL);
  glCompileShader(vertex_shader);
  fragment_shader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragment_shader, 1, &fragment_shader_text, NULL);
  glCompileShader(fragment_shader);
  program = glCreateProgram();
  glAttachShader(program, vertex_shader);
  glAttachShader(program, fragment_shader);
  glLinkProgram(program);
  glUseProgram(program);
  GLint positionLocation = glGetAttribLocation(program, "a_position");
  glUniform2f(glGetUniformLocation(program, "resolution"), (GLfloat)screenWidth, (GLfloat)screenHeight);
  GLint mouseLocation = glGetUniformLocation(program, "mouse");
  glUniform4f(mouseLocation, 0.0, 0.0, 0.0, 0.0);
  float mx = (float) std::max(screenWidth, screenHeight);
  float xdivmx = screenWidth / mx;
  float ydivmx = screenHeight / mx;
  GLint screenRatioLocation = glGetUniformLocation(program, "screenRatio");
  glUniform2f(screenRatioLocation, (GLfloat)xdivmx, (GLfloat)ydivmx);
  GLfloat timeLocation = glGetUniformLocation(program, "time");
  GLfloat vertices[] = {
        -1.0f, -1.0f,
        1.0f, -1.0f,
        -1.0f,  1.0f,
        -1.0f,  1.0f,
        1.0f, -1.0f,
        1.0f,  1.0f   // Top Left
    };
  GLuint VBO, VAO, EBO;
  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);
  glGenBuffers(1, &EBO);
  glBindVertexArray(VAO);

  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 0, (GLvoid*)0);
  glEnableVertexAttribArray(0);
  glBindBuffer(GL_ARRAY_BUFFER, 0);
  glBindVertexArray(0);
  mvp_location = glGetUniformLocation(program, "MVP");
  vpos_location = glGetAttribLocation(program, "vPos");
  vcol_location = glGetAttribLocation(program, "vCol");
  glEnableVertexAttribArray(vpos_location);
  glVertexAttribPointer(vpos_location, 2, GL_FLOAT, GL_FALSE,
                        sizeof(vertices[0]), (void*) 0);
  glEnableVertexAttribArray(vcol_location);
  glVertexAttribPointer(vcol_location, 3, GL_FLOAT, GL_FALSE,
                        sizeof(vertices[0]), (void*) (sizeof(float) * 2));
  while (!glfwWindowShouldClose(window))
  {
      glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
      glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);

      glUseProgram(program);

      glUniform1f(timeLocation, (GLfloat) glfwGetTime());

      glBindVertexArray(VAO);
      glDrawArrays(GL_TRIANGLES,0,6);
      glBindVertexArray(0);

      glfwSwapBuffers(window);
      glfwPollEvents();
  }
  glDeleteVertexArrays(1, &VAO);
  glDeleteBuffers(1, &VBO);
  glDeleteBuffers(1, &EBO);
  glfwDestroyWindow(window);
  glfwTerminate();
  return Boolean::New(env, true);
}

Object Init(Env env, Object exports) {
  exports["Test_GlfwInit"] = Function::New(env, Test_GlfwInit);
  exports["Test_GlfwIncluded"] = Function::New(env, Test_GlfwIncluded);
  exports["Test_GladIncluded"] = Function::New(env, Test_GladIncluded);
  exports["GlfwGetVersion"] = Function::New(env, GlfwGetVersion);
  exports["GlfwTestOpenWindow"] = Function::New(env, GlfwTestOpenWindow);
  return exports;
}

NODE_API_MODULE(addon, Init)
