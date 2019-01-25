#ifdef RENDER_API_OPENGL

// OpenGL
#include <glad/glad.h>

#include "ShaderData.h"
#include "../Window.h"
#include <Engine/Tools/FS.h>
#include <string>

namespace Kepler {

void Window::CompileShader(Shader *shader) {
  ShaderData shaderData;

  // Vertex Shader
  shaderData.vertex = glCreateShader(GL_VERTEX_SHADER);
  std::string vertexText = FS::ReadFile(shader->filename + ".vert.glsl");
  const char *vertexTextCStr = vertexText.c_str();
  glShaderSource(shaderData.vertex, 1, &vertexTextCStr, NULL);
  glCompileShader(shaderData.vertex);

  // Fragment Shader
  shaderData.fragment = glCreateShader(GL_FRAGMENT_SHADER);
  std::string fragmentText = FS::ReadFile(shader->filename + ".frag.glsl");
  const char *fragmentTextCStr = fragmentText.c_str();
  glShaderSource(shaderData.fragment, 1, &fragmentTextCStr, NULL);
  glCompileShader(shaderData.fragment);

  // Shader program
  shaderData.program = glCreateProgram();
  glAttachShader(shaderData.program, shaderData.vertex);
  glAttachShader(shaderData.program, shaderData.fragment);
  glLinkProgram(shaderData.program);

  shader->data = &shaderData;
}

}

#endif
