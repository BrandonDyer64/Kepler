#version 450
#extension GL_ARB_separate_shader_objects:enable

layout(location=0)in vec2 v_uv;
layout(location=0)out vec4 target0;

#define iTime 2.

const int MAX_MARCHING_STEPS=64;
const int MAX_REFLECTION_BOUNCES=1;
const int MAX_REFLECTION_STEPS=32;
const int MAX_DIFFUSE_BOUNCES=1;
const int MAX_DIFFUSE_STEPS=16;
const int MAX_SUBSURF_STEPS=16;
const float MIN_DIST=0.;
const float MAX_DIST=100.;
const float EPSILON=.0001;

struct Surface{
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

float hash(float seed){
    return fract(sin(seed)*43758.5453);
}

vec3 cosineDirection(in float seed,in vec3 nor){
    float u=hash(78.233+seed);
    float v=hash(10.873+seed);
    
    // Method 1 and 2 first generate a frame of reference to use with an arbitrary
    // distribution, cosine in this case. Method 3 (invented by fizzer) specializes
    // the whole math to the cosine distribution and simplfies the result to a more
    // compact version that does not depend on a full frame of reference.
    
    #if 0
    // method 1 by http://orbit.dtu.dk/fedora/objects/orbit:113874/datastreams/file_75b66578-222e-4c7d-abdf-f7e255100209/content
    vec3 tc=vec3(1.+nor.z-nor.xy*nor.xy,-nor.x*nor.y)/(1.+nor.z);
    vec3 uu=vec3(tc.x,tc.z,-nor.x);
    vec3 vv=vec3(tc.z,tc.y,-nor.y);
    
    float a=6.2831853*v;
    return sqrt(u)*(cos(a)*uu+sin(a)*vv)+sqrt(1.-u)*nor;
    #endif
    #if 1
    // method 2 by pixar:  http://jcgt.org/published/0006/01/01/paper.pdf
    float ks=(nor.z>=0.)?1.:-1.;//do not use sign(nor.z), it can produce 0.0
    float ka=1./(1.+abs(nor.z));
    float kb=-ks*nor.x*nor.y*ka;
    vec3 uu=vec3(1.-nor.x*nor.x*ka,ks*kb,-ks*nor.x);
    vec3 vv=vec3(kb,ks-nor.y*nor.y*ka*ks,-nor.y);
    
    float a=6.2831853*v;
    return sqrt(u)*(cos(a)*uu+sin(a)*vv)+sqrt(1.-u)*nor;
    #endif
    #if 0
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
float unionSDF(float distA, float distB) {
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
float cylinderSDF(vec3 p, float h, float r) {
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

/**
 * Signed distance function describing the scene.
 * 
 * Absolute value of the return value indicates the distance to the surface.
 * Sign indicates whether the point is inside or outside the surface,
 * negative indicating inside.
 */
float sceneSDF(vec3 samplePoint) {    
    // Slowly spin the whole scene
    samplePoint = rotateY(iTime / 2.0) * samplePoint;
    
    float cylinderRadius = 0.4 + (1.0 - 0.4) * (1.0 + sin(1.7 * iTime)) / 2.0;
    float cylinder1 = cylinderSDF(samplePoint, 2.0, cylinderRadius);
    float cylinder2 = cylinderSDF(rotateX(radians(90.0)) * samplePoint, 2.0, cylinderRadius);
    float cylinder3 = cylinderSDF(rotateY(radians(90.0)) * samplePoint, 2.0, cylinderRadius);
    
    float cube = boxSDF(samplePoint, vec3(1.8, 1.8, 1.8));
    
    float sphere = sphereSDF(samplePoint, 1.2);
    
    float ballOffset = 0.4 + 1.0 + sin(1.7 * iTime);
    float ballRadius = 0.3;
    float balls = sphereSDF(samplePoint - vec3(ballOffset, 0.0, 0.0), ballRadius);
    balls = unionSDF(balls, sphereSDF(samplePoint + vec3(ballOffset, 0.0, 0.0), ballRadius));
    balls = unionSDF(balls, sphereSDF(samplePoint - vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = unionSDF(balls, sphereSDF(samplePoint + vec3(0.0, ballOffset, 0.0), ballRadius));
    balls = unionSDF(balls, sphereSDF(samplePoint - vec3(0.0, 0.0, ballOffset), ballRadius));
    balls = unionSDF(balls, sphereSDF(samplePoint + vec3(0.0, 0.0, ballOffset), ballRadius));
    
    
    
    float csgNut = differenceSDF(intersectSDF(cube, sphere),
    unionSDF(cylinder1, unionSDF(cylinder2, cylinder3)));
    
    return unionSDF(balls, csgNut);
}

/**
 * Return the shortest distance from the eyepoint to the scene surface along
 * the marching direction. If no part of the surface is found between start and end,
 * return end.
 * 
 * eye: the eye point, acting as the origin of the ray
 * marchingDirection: the normalized direction to march in
 * start: the starting distance away from the eye
 * end: the max distance away from the ey to march before giving up
 */
float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end, const int steps) {
    float depth = start;
    for (int i = 0; i < steps; i++) {
        vec3 pos = eye + depth * marchingDirection;
        float dist = sceneSDF(pos);
        depth += dist;
    }
    return depth;
}
            

/**
 * Return the normalized direction to march in from the eye point for a single pixel.
 * 
 * fieldOfView: vertical field of view in degrees
 * size: resolution of the output image
 * fragCoord: the x,y coordinate of the pixel in the output image
 */
vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

/**
 * Using the gradient of the SDF, estimate the normal on the surface at point p.
 */
vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
            sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
            sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
            sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
        ));
    }
    
    /**
    * Lighting contribution of a single point light source via Phong illumination.
    *
    * The vec3 returned is the RGB color of the light's contribution.
    *
    * k_a: Ambient color
    * k_d: Diffuse color
    * k_s: Specular color
    * alpha: Shininess coefficient
    * p: position of point being lit
    * eye: the position of the camera
    * lightPos: the position of the light
    * lightIntensity: color/intensity of the light
    *
    * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
    */
    vec3 phongContribForLight(
        vec3 k_d, vec3 k_s,
        float alpha, vec3 p, vec3 eye,
        vec3 lightPos, vec3 lightIntensity
    ) {
        vec3 N = estimateNormal(p);
        vec3 L = normalize(lightPos - p);
        vec3 V = normalize(eye - p);
        vec3 R = normalize(reflect(-L, N));
        
        float dotLN = dot(L, N);
        float dotRV = dot(R, V);
        
        if (dotLN < 0.0) {
            // Light not visible from this point on the surface
            return vec3(0.0, 0.0, 0.0);
        }
        
        if (dotRV < 0.0) {
            // Light reflection in opposite direction as viewer, apply only diffuse
            // component
            return lightIntensity * (k_d * dotLN);
        }
        return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
    }
    
    /**
    * Lighting via Phong illumination.
    *
    * The vec3 returned is the RGB color of that point after lighting is applied.
    * k_a: Ambient color
    * k_d: Diffuse color
    * k_s: Specular color
    * alpha: Shininess coefficient
    * p: position of point being lit
    * eye: the position of the camera
    *
    * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
    */
    vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
        const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
        vec3 color = ambientLight * k_a;
        
        vec3 light1Pos = vec3(4.0 * sin(iTime),
        2.0,
        4.0 * cos(iTime));
        vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
        
        color += phongContribForLight(k_d, k_s, alpha, p, eye,
            light1Pos,
        light1Intensity);
        
        vec3 light2Pos = vec3(2.0 * sin(0.37 * iTime),
        2.0 * cos(0.37 * iTime),
    2.0);
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
        light2Pos,
    light2Intensity);
    return color;
}

/**
 * Return a transform matrix that will transform a ray from view space
 * to world coordinates, given the eye point, the camera target, and an up vector.
 *
 * This assumes that the center of the camera is aligned with the negative z axis in
 * view space when calculating the ray marching direction. See rayDirection.
 */
mat3 viewMatrix(vec3 eye,vec3 center,vec3 up){
    // Based on gluLookAt man page
    vec3 f=normalize(center-eye);
    vec3 s=normalize(cross(f,up));
    vec3 u=cross(s,f);
    return mat3(s,u,-f);
}

const vec2 iResolution=vec2(1280,720);

vec3 getPixel(vec2 pixel,int samp){
    vec3 viewDir=rayDirection(45.,iResolution.xy,vec2(pixel.x,iResolution.y-pixel.y));
    vec3 eye=vec3(8.,5.*sin(.2*iTime),7.);
    
    mat3 viewToWorld=viewMatrix(eye,vec3(0.,0.,0.),vec3(0.,1.,0.));
    
    vec3 worldDir=viewToWorld*viewDir;
    
    float dist=shortestDistanceToSurface(eye,worldDir,MIN_DIST,MAX_DIST,MAX_MARCHING_STEPS);
    
    if(dist>MAX_DIST-EPSILON){
        // Didn't hit anything
        return vec3(0);
    }
    
    // The closest point on the surface to the eyepoint along the view ray
    vec3 p=eye+dist*worldDir;
    
    // Use the surface normal as the ambient color of the material
    vec3 normal=estimateNormal(p);
    vec3 K_a=(normal+vec3(1.))/2.;
    vec3 K_d=K_a;
    vec3 K_s=vec3(1.,1.,1.);
    float shininess=10.;
    
    // vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    vec3 color=vec3(.5);
    
    dist=shortestDistanceToSurface(p+normal/1000.,mix(reflect(worldDir,normal),cosineDirection(gl_FragCoord.x*gl_FragCoord.y+float(samp),normal),.1),MIN_DIST,MAX_DIST,MAX_REFLECTION_STEPS);
    
    if(dist>MAX_DIST-EPSILON){
        // Didn't hit anything
        return color;
    }
    
    return vec3(.1);
}

const float SAMPLES=1.;

void main(){
    vec3 color=vec3(0);
    float mlaa_width=sqrt(SAMPLES);
    for(int i=0;i<SAMPLES;i++){
        vec2 xy=vec2(
            gl_FragCoord.x+mod(float(i),mlaa_width)/mlaa_width,
            gl_FragCoord.y+float(i)/SAMPLES
        );
        color+=getPixel(xy,i)/SAMPLES;
    }
    target0=vec4(color,1.);
}
