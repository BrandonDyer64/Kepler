
void main() {
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
float float_m_float67num = 20.0;
vec3 vec3_m_multiply66product = vec3_m_texCoord60coords * float_m_float67num;
float float_m_float72num = 1.0;
float float_m_noise64out = noise(vec3_m_multiply66product,float_m_float72num);
float float_m_sigmoid71out = sigmoid(float_m_noise64out);
float float_m_float70num = 2.0;
float float_m_power69product = pow(float_m_sigmoid71out, float(float_m_float70num));
float float_m_sigmoid73out = sigmoid(float_m_power69product);
vec3 vec3_m_vectorize65xyz = vec3(float_m_sigmoid73out);
float float_m_float77num = 10.0;
vec3 vec3_m_divide76divided = vec3_m_multiply66product / float_m_float77num;
float float_m_time80time = u_time;
vec3 vec3_m_add79sum = vec3_m_divide76divided + float_m_time80time;
float float_m_noise75out = noise(vec3_m_add79sum,float_m_float72num);
float float_m_unbalance78unbalanced = float_m_noise75out / 2.0 + 0.5;
float float_m_multiply83product = float_m_power69product * float_m_unbalance78unbalanced;
gl_FragColor = vec4(vec3_m_vectorize65xyz,0);
}
