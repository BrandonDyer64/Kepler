
void main() {
float float_m_float97num = 0.0;
vec3 vec3_m_vectorize99xyz = vec3(float_m_float97num);
float float_m_float101num = 1.0;
vec3 vec3_m_makeVec3100xyz = vec3(float_m_float97num, float_m_float101num, float_m_float97num);
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
float float_m_float62num = 20.0;
vec3 vec3_m_multiply61product = vec3_m_texCoord60coords * float_m_float62num;
float float_m_float78num = 1.0;
float float_m_noise63out = noise(vec3_m_multiply61product,float_m_float78num);
float float_m_unbalance85unbalanced = float_m_noise63out / 2.0 + 0.5;
vec3 vec3_m_lerp96out = mix(vec3_m_vectorize99xyz, vec3_m_makeVec3100xyz, float_m_unbalance85unbalanced);
float float_m_float82num = 30.0;
vec3 vec3_m_divide81divided = vec3_m_multiply61product / float_m_float82num;
float float_m_time88time = u_time;
vec3 vec3_m_add87sum = vec3_m_divide81divided + float_m_time88time;
float float_m_noise79out = noise(vec3_m_add87sum,float_m_float78num);
float float_m_unbalance86unbalanced = float_m_noise79out / 2.0 + 0.5;
float float_m_float92num = 4.0;
float float_m_divide91divided = float_m_unbalance86unbalanced / float_m_float92num;
float float_m_float95num = 1.0;
float float_m_float103num = 1.0;
float float_m_divide102divided = float_m_float103num / float_m_float92num;
float float_m_subtract104difference = float_m_float95num - float_m_divide102divided;
float float_m_add94sum = float_m_divide91divided + float_m_subtract104difference;
float float_m_multiply93product = float_m_unbalance85unbalanced * float_m_add94sum;
gl_FragColor = vec4(vec3_m_lerp96out,0);
}
