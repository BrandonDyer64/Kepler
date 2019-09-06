#version 450
#extension GL_ARB_separate_shader_objects:enable

layout(location=0)in vec2 v_uv;
layout(location=0)out vec4 target0;

#define iTime 2.

const int SAMPLES = 4;
const int MAX_MARCHING_STEPS = 512;
const int MAX_DIFFUSE_BOUNCES = 3;
const int MAX_DIFFUSE_STEPS = 8;
const int MAX_REFLECTION_BOUNCES = 2;
const int MAX_REFLECTION_STEPS = 128;
const int MAX_SUBSURF_STEPS = 4;
const float MIN_DIST = 0.;
const float EPSILON = .0001;

struct Surface {
    float base_color;
    float subsurface;
    float subsurface_color;
    float metalic;
    float specular;
    float roughness;
    float ior;
    float transmission;
    float emission;
};

float hash(float seed) {
    return fract(sin(seed)*43758.5453);
}

vec3 cosine_direction(in float seed, in vec3 nor) {
    float u = hash(78.233 + seed);
    float v = hash(10.873 + seed);
    float a = 6.2831853 * v;
    u = 2. * u-1.;
    return normalize(nor + vec3(sqrt(1. - u * u) * vec2(cos(a), sin(a)), u));
}

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}

float sdf_union(float distA, float distB) {
    return min(distA, distB);
}

float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

float boxSDF(vec3 p, vec3 size) {
    vec3 d = abs(p) - (size / 2.0);
    float inside_distance = min(max(d.x, max(d.y, d.z)), 0.0);
    float outside_distance = length(max(d, 0.0));
    return inside_distance + outside_distance;
}

float sdf_sphere(vec3 pos, float radius) {
    return length(pos) - radius;
}

float sdf_cylinder(vec3 p, float h, float r) {
    float in_out_radius = length(p.xy) - r;
    float in_out_height = abs(p.z) - h/2.0;
    float inside_distance = min(max(in_out_radius, in_out_height), 0.0);
    float outside_distance = length(max(vec2(in_out_radius, in_out_height), 0.0));
    return inside_distance + outside_distance;
}

float sdf_scene(vec3 sample_point) {
    sample_point = rotateY(iTime / 2.0) * sample_point;
    sample_point = mod(sample_point+5., 10.)-5.;

    float cylinderRadius = 0.4 + (1.0 - 0.4) * (1.0 + sin(1.7 * iTime)) / 2.0;
    float cylinder1 = sdf_cylinder(sample_point, 2.0, cylinderRadius);
    float cylinder2 = sdf_cylinder(rotateX(radians(90.0)) * sample_point, 2.0, cylinderRadius);
    float cylinder3 = sdf_cylinder(rotateY(radians(90.0)) * sample_point, 2.0, cylinderRadius);

    float cube = boxSDF(sample_point, vec3(1.8, 1.8, 1.8));

    float sphere = sdf_sphere(sample_point, 1.2);

    float ballOffset = 0.4 + 1.0 + sin(1.7 * iTime);
    float ballRadius = 0.3;
    float balls = sdf_sphere(sample_point - vec3(ballOffset, 0.0, 0.0), ballRadius);
    balls = sdf_union(balls, sdf_sphere(sample_point + vec3(ballOffset, 0.0, 0.0), ballRadius));
    balls = sdf_union(balls, sdf_sphere(sample_point - vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = sdf_union(balls, sdf_sphere(sample_point + vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = sdf_union(balls, sdf_sphere(sample_point - vec3(0.0, 0.0, ballOffset), ballRadius));
    balls = sdf_union(balls, sdf_sphere(sample_point + vec3(0.0, 0.0, ballOffset), ballRadius));

    float csgNut = differenceSDF(intersectSDF(cube, sphere),
    sdf_union(cylinder1, sdf_union(cylinder2, cylinder3)));
    
    return sdf_union(balls, csgNut);
}

float shortest_distance_to_surface(vec3 eye, vec3 marching_direction, float start, const int steps) {
    float depth = start;
    for (int i = 0; i < steps; i++) {
        vec3 pos = eye + depth * marching_direction;
        float dist = sdf_scene(pos);
        if (dist < EPSILON) {
            return depth;
        }
        depth += dist;
    }
    return -1.;
}

vec3 ray_dir(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

vec3 get_normal(vec3 pos) {
    return normalize(vec3(
        sdf_scene(vec3(pos.x, pos.y + EPSILON, pos.z)) - sdf_scene(vec3(pos.x, pos.y - EPSILON, pos.z)),
        sdf_scene(vec3(pos.x + EPSILON, pos.y, pos.z)) - sdf_scene(vec3(pos.x - EPSILON, pos.y, pos.z)),
        sdf_scene(vec3(pos.x, pos.y, pos.z  + EPSILON)) - sdf_scene(vec3(pos.x, pos.y, pos.z - EPSILON))
    ));
}

mat3 view_matrix(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}

const vec2 iResolution = vec2(1280, 720);

vec3 get_pixel(vec3 eye, vec3 view_dir, float seed, int bounce) {
    if (bounce < 0) return vec3(0);

    mat3 view_to_world = view_matrix(eye,vec3(0.,0.,0.),vec3(0.,1.,0.));

    vec3 worldDir = view_to_world * view_dir;

    float dist = shortest_distance_to_surface(eye, worldDir, MIN_DIST, MAX_MARCHING_STEPS);

    if(dist < 0) return vec3(0);

    vec3 p = eye + dist * worldDir;
    vec3 normal = get_normal(p);
    p += normal * EPSILON;

    // TODO: use actual color
    vec3 color = vec3(.5);

    vec3 dir_diffuse = cosine_direction(gl_FragCoord.x * gl_FragCoord.y + seed, normal);
    vec3 dir_reflect = reflect(worldDir, normal);

    return get_pixel(p, dir_diffuse, seed * 31.65983, bounce - 1);
}

void main() {
    float samples = float(SAMPLES);
    vec3 color = vec3(0);
    float mlaa_width = sqrt(samples);
    vec3 eye = vec3(8., 5. * sin(.2 * iTime), 7.);
    for(int i = 0; i < samples; i++) {
        vec2 pixel = vec2(
            gl_FragCoord.x + mod(float(i), mlaa_width) / mlaa_width,
            gl_FragCoord.y + float(i) / samples
        );
        vec3 view_dir = ray_dir(45., iResolution.xy, vec2(pixel.x, iResolution.y - pixel.y));
        color += get_pixel(eye, view_dir, float(i), MAX_BOUNCES) / samples;
    }
    target0 = vec4(color, 1.);
}
