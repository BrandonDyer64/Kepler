vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
// First corner
vec3 i = floor(v + dot(v, C.yyy) );
vec3 x0 = v - i + dot(i, C.xxx) ;
// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );
// x0 = x0 - 0. + 0.0 * C
vec3 x1 = x0 - i1 + 1.0 * C.xxx;
vec3 x2 = x0 - i2 + 2.0 * C.xxx;
vec3 x3 = x0 - 1. + 3.0 * C.xxx;
// Permutations
i = mod(i, 289.0 );
vec4 p = permute( permute( permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
float n_ = 1.0/7.0; // N=7
vec3 ns = n_ * D.wyz - D.xzx;
vec4 j = p - 49.0 * floor(p * ns.z *ns.z); // mod(p,N*N)
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ ); // mod(j,N)
vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);
vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));
vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);
//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;
// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
dot(p2,x2), dot(p3,x3) ) );
}
const int MAX_PASSES = 10;
float noise(vec3 coord, float passes) {
coord.z += 200.0;
float value = 0.0;
for (int i = 1; i < MAX_PASSES + 1; i++) {
if (float(i) > passes) break;
value += (snoise(coord * vec3(i)) / float(i)) * (i == 1 ? 1.0 : -1.0);
}
return value;
}
float sigmoid(float x) {
if (x >= 1.0) return 1.0;
else if (x <= -1.0) return 0.0;
else return 0.5 + x * (1.0 - abs(x) * 0.5);
}
const int steps = 128;
const float stepSize = 1.0 / float(steps);
float getParallaxValue(vec2 offset, float depth) {
vec2 texCoord = gl_FragCoord.xy / iResolution.xy - offset;
vec2 viewVector = iMouse.xy * 2.0 - 1.0;
float float_m_parallaxDepth116depth = depth;
float float_m_invert120inverted = 1.0 - float_m_parallaxDepth116depth;
float float_m_float167num = 4.0;
float float_m_power166product = pow(float_m_invert120inverted, float(float_m_float167num));
vec3 vec3_m_vectorize113xyz = vec3(float_m_power166product);
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
float float_m_float164num = 1.0;
float float_m_float162num = 1.0;
float float_m_parallaxDepth146depth = depth;
float float_m_subtract161difference = float_m_float162num - float_m_parallaxDepth146depth;
float float_m_float160num = 2.0;
float float_m_power159product = pow(float_m_subtract161difference, float(float_m_float160num));
float float_m_subtract163difference = float_m_float164num - float_m_power159product;
float float_m_float153num = 0.0;
vec3 vec3_m_makeVec3152xyz = vec3(float_m_subtract163difference, float_m_float153num, float_m_float153num);
vec3 vec3_m_add145sum = vec3_m_texCoord60coords + vec3_m_makeVec3152xyz;
float float_m_float144num = 120.0;
vec3 vec3_m_multiply114product = vec3_m_add145sum * float_m_float144num;
float float_m_float158num = 8.0;
float float_m_float157num = 1.0;
vec3 vec3_m_makeVec3156xyz = vec3(float_m_float158num, float_m_float157num, float_m_float157num);
vec3 vec3_m_divide155divided = vec3_m_multiply114product / vec3_m_makeVec3156xyz;
float float_m_float137num = 1.0;
float float_m_noise108out = noise(vec3_m_divide155divided,float_m_float137num);
float float_m_sigmoid165out = sigmoid(float_m_noise108out);
float float_m_unbalance117unbalanced = float_m_sigmoid165out / 2.0 + 0.5;
return float_m_unbalance117unbalanced;
}
void main() {
vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
vec2 viewVector = iMouse.xy * 2.0 - 1.0;
vec2 offset = vec2(0);
float depth = 0.0;
float heightOld = -1.0;
int parallaxPass = 0;
int parallaxPasses = mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y),2.0) == 0.0 ? 1 : 2;
for (int i = 1; i <= steps; i++) {
depth = float(i) * stepSize;
offset = viewVector * depth;
		float height = 1.0 - getParallaxValue(offset, depth);
if (height <= float(i) * stepSize) {
parallaxPass++;
if (parallaxPass >= parallaxPasses) {
break;
}
}
}
texCoord -= offset;
float float_m_parallaxDepth116depth = depth;
float float_m_invert120inverted = 1.0 - float_m_parallaxDepth116depth;
float float_m_float167num = 4.0;
float float_m_power166product = pow(float_m_invert120inverted, float(float_m_float167num));
vec3 vec3_m_vectorize113xyz = vec3(float_m_power166product);
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
float float_m_float164num = 1.0;
float float_m_float162num = 1.0;
float float_m_parallaxDepth146depth = depth;
float float_m_subtract161difference = float_m_float162num - float_m_parallaxDepth146depth;
float float_m_float160num = 2.0;
float float_m_power159product = pow(float_m_subtract161difference, float(float_m_float160num));
float float_m_subtract163difference = float_m_float164num - float_m_power159product;
float float_m_float153num = 0.0;
vec3 vec3_m_makeVec3152xyz = vec3(float_m_subtract163difference, float_m_float153num, float_m_float153num);
vec3 vec3_m_add145sum = vec3_m_texCoord60coords + vec3_m_makeVec3152xyz;
float float_m_float144num = 120.0;
vec3 vec3_m_multiply114product = vec3_m_add145sum * float_m_float144num;
float float_m_float158num = 8.0;
float float_m_float157num = 1.0;
vec3 vec3_m_makeVec3156xyz = vec3(float_m_float158num, float_m_float157num, float_m_float157num);
vec3 vec3_m_divide155divided = vec3_m_multiply114product / vec3_m_makeVec3156xyz;
float float_m_float137num = 1.0;
float float_m_noise108out = noise(vec3_m_divide155divided,float_m_float137num);
float float_m_sigmoid165out = sigmoid(float_m_noise108out);
float float_m_unbalance117unbalanced = float_m_sigmoid165out / 2.0 + 0.5;
gl_FragColor = vec4(vec3_m_vectorize113xyz,0);
}
