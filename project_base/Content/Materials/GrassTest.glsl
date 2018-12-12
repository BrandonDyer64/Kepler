
void main() {
vec3 vec3_m_texCoord87coords = vec3(texCoord,0);
float float_m_noise85out = noise(vec3_m_texCoord87coords,3.0);
vec3 vec3_m_vectorize86xyz = vec3(float_m_noise85out);
gl_FragColor = vec4(vec3_m_vectorize86xyz,0);
}
