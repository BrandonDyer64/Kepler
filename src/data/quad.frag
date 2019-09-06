#version 450
#extension GL_ARB_separate_shader_objects:enable

layout(location=0)in vec2 v_uv;
layout(location=0)out vec4 target0;

#define iTime 2.

const int MAX_MARCHING_STEPS=512;
const int MAX_REFLECTION_BOUNCES=1;
const int MAX_REFLECTION_STEPS=128;
const int MAX_DIFFUSE_BOUNCES=1;
const int MAX_DIFFUSE_STEPS=8;
const int MAX_SUBSURF_STEPS=4;
const float MIN_DIST=0.;
const float EPSILON=.0001;

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

vec3 cosine_direction(in float seed,in vec3 nor) {
    float u=hash(78.233+seed);
    float v=hash(10.873+seed);
    
    #if 0
    // method 1 by http://orbit.dtu.dk/fedora/objects/orbit:113874/datastreams/file_75b66578-222e-4c7d-abdf-f7e255100209/content
    vec3 tc=vec3(1.+nor.z-nor.xy*nor.xy,-nor.x*nor.y)/(1.+nor.z);
    vec3 uu=vec3(tc.x,tc.z,-nor.x);
    vec3 vv=vec3(tc.z,tc.y,-nor.y);
    
    float a=6.2831853*v;
    return sqrt(u)*(cos(a)*uu+sin(a)*vv)+sqrt(1.-u)*nor;
    #endif
    #if 0
    // method 2 by pixar:  http://jcgt.org/published/0006/01/01/paper.pdf
    float ks=(nor.z>=0.)?1.:-1.;//do not use sign(nor.z), it can produce 0.0
    float ka=1./(1.+abs(nor.z));
    float kb=-ks*nor.x*nor.y*ka;
    vec3 uu=vec3(1.-nor.x*nor.x*ka,ks*kb,-ks*nor.x);
    vec3 vv=vec3(kb,ks-nor.y*nor.y*ka*ks,-nor.y);
    
    float a=6.2831853*v;
    return sqrt(u)*(cos(a)*uu+sin(a)*vv)+sqrt(1.-u)*nor;
    #endif
    #if 1
    // method 3 by fizzer: http://www.amietia.com/lambertnotangent.html
    float a=6.2831853*v;
    u=2.*u-1.;
    return normalize(nor+vec3(sqrt(1.-u*u)*vec2(cos(a),sin(a)),u));
    #endif
}

/**
 * Rotation matrix around the X axis.
 */
mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

/**
 * Rotation matrix around the Y axis.
 */
mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

/**
 * Rotation matrix around the Z axis.
 */
mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

/**
 * Constructive solid geometry intersection operation on SDF-calculated distances.
 */
float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}

/**
 * Constructive solid geometry union operation on SDF-calculated distances.
 */
float sdf_union(float distA, float distB) {
    return min(distA, distB);
}

/**
 * Constructive solid geometry difference operation on SDF-calculated distances.
 */
float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

/**
 * Signed distance function for a cube centered at the origin
 * with dimensions specified by size.
 */
float boxSDF(vec3 p, vec3 size) {
    vec3 d = abs(p) - (size / 2.0);
    
    // Assuming p is inside the cube, how far is it from the surface?
    // Result will be negative or zero.
    float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);
    
    // Assuming p is outside the cube, how far is it from the surface?
    // Result will be positive or zero.
    float outsideDistance = length(max(d, 0.0));
    
    return insideDistance + outsideDistance;
}

/**
 * Signed distance function for a sphere centered at the origin with radius r.
 */
float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

/**
 * Signed distance function for an XY aligned cylinder centered at the origin with
 * height h and radius r.
 */
float sdf_cylinder(vec3 p, float h, float r) {
    // How far inside or outside the cylinder the point is, radially
    float inOutRadius = length(p.xy) - r;
    
    // How far inside or outside the cylinder is, axially aligned with the cylinder
    float inOutHeight = abs(p.z) - h/2.0;
    
    // Assuming p is inside the cylinder, how far is it from the surface?
    // Result will be negative or zero.
    float insideDistance = min(max(inOutRadius, inOutHeight), 0.0);
    
    // Assuming p is outside the cylinder, how far is it from the surface?
    // Result will be positive or zero.
    float outsideDistance = length(max(vec2(inOutRadius, inOutHeight), 0.0));
    
    return insideDistance + outsideDistance;
}

float sdf_scene(vec3 sample_point) {
    // Slowly spin the whole scene
    sample_point = rotateY(iTime / 2.0) * sample_point;
    sample_point = mod(sample_point+5., 10.)-5.;
    
    float cylinderRadius = 0.4 + (1.0 - 0.4) * (1.0 + sin(1.7 * iTime)) / 2.0;
    float cylinder1 = sdf_cylinder(sample_point, 2.0, cylinderRadius);
    float cylinder2 = sdf_cylinder(rotateX(radians(90.0)) * sample_point, 2.0, cylinderRadius);
    float cylinder3 = sdf_cylinder(rotateY(radians(90.0)) * sample_point, 2.0, cylinderRadius);
    
    float cube = boxSDF(sample_point, vec3(1.8, 1.8, 1.8));
    
    float sphere = sphereSDF(sample_point, 1.2);
    
    float ballOffset = 0.4 + 1.0 + sin(1.7 * iTime);
    float ballRadius = 0.3;
    float balls = sphereSDF(sample_point - vec3(ballOffset, 0.0, 0.0), ballRadius);
    balls = sdf_union(balls, sphereSDF(sample_point + vec3(ballOffset, 0.0, 0.0), ballRadius));
    balls = sdf_union(balls, sphereSDF(sample_point - vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = sdf_union(balls, sphereSDF(sample_point + vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = sdf_union(balls, sphereSDF(sample_point - vec3(0.0, 0.0, ballOffset), ballRadius));
    balls = sdf_union(balls, sphereSDF(sample_point + vec3(0.0, 0.0, ballOffset), ballRadius));
    
    
    
    float csgNut = differenceSDF(intersectSDF(cube, sphere),
    sdf_union(cylinder1, sdf_union(cylinder2, cylinder3)));
    
    return sdf_union(balls, csgNut);
}

/**
 * Return the shortest distance from the eyepoint to the scene surface along
 * the marching direction. If no part of the surface is found between start and end,
 * return end.
 * 
 * eye: the eye point, acting as the origin of the ray
 * marching_direction: the normalized direction to march in
 * start: the starting distance away from the eye
 * end: the max distance away from the ey to march before giving up
 */
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
            

/**
 * Return the normalized direction to march in from the eye point for a single pixel.
 * 
 * fieldOfView: vertical field of view in degrees
 * size: resolution of the output image
 * fragCoord: the x,y coordinate of the pixel in the output image
 */
vec3 ray_dir(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

/**
 * Using the gradient of the SDF, estimate the normal on the surface at point p.
 */
vec3 get_normal(vec3 pos) {
    return normalize(vec3(
        sdf_scene(vec3(pos.x, pos.y + EPSILON, pos.z)) - sdf_scene(vec3(pos.x, pos.y - EPSILON, pos.z)),
        sdf_scene(vec3(pos.x + EPSILON, pos.y, pos.z)) - sdf_scene(vec3(pos.x - EPSILON, pos.y, pos.z)),
        sdf_scene(vec3(pos.x, pos.y, pos.z  + EPSILON)) - sdf_scene(vec3(pos.x, pos.y, pos.z - EPSILON))
    ));
}
mat3 view_matrix(vec3 eye, vec3 center, vec3 up) {
    // Based on gluLookAt man page

    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}
vec3 do_diffuse_lighting(vec3 eye, vec3 normal, vec3 point, vec3 color, float samp){
    int bounces;

    for (int i = 0; i < MAX_DIFFUSE_BOUNCES; i++) {
        float dist = shortest_distance_to_surface(
            eye,
            cosine_direction(gl_FragCoord.x * gl_FragCoord.y + float(samp), normal),
            MIN_DIST,
            MAX_DIFFUSE_STEPS
        );
        if (dist < 0) {
            //Didn't hit anything
            return color;
        }
        bounces++;
    }
    //Replace with color retrieved from surface.
    switch (bounces) {
        case 1:
            return (color * vec3(1.0, 0.8, 0.8));
        case 2:
            return (color * vec3(1.0, 0.5, 0.5));
        case 3:
            return (color * vec3(1.0, 0.0, 0.0));
        case 4:
            return (vec3(0.0, 1.0, 0.0));
    }
}

const vec2 iResolution = vec2(1280, 720);

vec3 get_pixel(vec2 pixel, int samp) {
    vec3 viewDir = ray_dir(45., iResolution.xy, vec2(pixel.x, iResolution.y - pixel.y));
    vec3 eye = vec3(8., 5. * sin(.2 * iTime), 7.);
    
    mat3 viewToWorld = view_matrix(eye,vec3(0.,0.,0.),vec3(0.,1.,0.));
    
    vec3 worldDir = viewToWorld * viewDir;
    
    float dist = shortest_distance_to_surface(eye, worldDir, MIN_DIST, MAX_MARCHING_STEPS);
    
    if(dist < 0) {
        // Didn't hit anything
        return vec3(0);
    }
    
    // The closest point on the surface to the eyepoint along the view ray
    vec3 p = eye + dist * worldDir;
    
    // Use the surface normal as the ambient color of the material
    vec3 normal = get_normal(p);
    
    // vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    vec3 color = vec3(.5);
    
    dist = shortest_distance_to_surface(p+normal/1000.,mix(reflect(worldDir,normal),cosine_direction(gl_FragCoord.x*gl_FragCoord.y+float(samp),normal),0.0),MIN_DIST,MAX_REFLECTION_STEPS);
    
    if(dist < 0) {
        // Didn't hit anything
        return color;
    }
    
    return vec3(.1);
}

const float SAMPLES = 4.;

void main() {
    vec3 color = vec3(0);
    float mlaa_width = sqrt(SAMPLES);
    for(int i = 0; i < SAMPLES; i++) {
        vec2 xy = vec2(
            gl_FragCoord.x + mod(float(i), mlaa_width) / mlaa_width,
            gl_FragCoord.y + float(i) / SAMPLES
        );
        color += get_pixel(xy, i) / SAMPLES;
    }
    target0 = vec4(color, 1.);
}
