#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec2 v_uv;
layout(location = 0) out vec4 target0;

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
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}
float sphereSDF(vec3 samplePoint) {
    return length(vec3(samplePoint.x, samplePoint.y+0.0, samplePoint.z + 3.0)) - 1.0;
}
float floorSDF(vec3 samplePoint) {
  return samplePoint.y + 0.5;
}
float sceneSDF(vec3 samplePoint) {
    return smin(sphereSDF(samplePoint), floorSDF(samplePoint), 0.1);
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
    vec2 pixel_coord = vec2(gl_FragCoord.x, 720. - gl_FragCoord.y);
    vec3 dir = rayDirection(45.0, vec2(1280., 720.), pixel_coord);
    vec3 eye = vec3(0.0f, 0.4f, 5.0f);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        target0 = vec4(vec3(0, 0, 0), 1);
        return;
    }
    target0 = vec4(vec3(1.0 - dist / 10.0), 1.0);
}
