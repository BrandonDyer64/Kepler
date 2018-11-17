
void main() {
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
