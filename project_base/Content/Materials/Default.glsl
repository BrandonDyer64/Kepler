
void main() {
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
vec3 vec3_m_invert61inverted = vec3(
1.0 - vec3_m_texCoord60coords.x,
1.0 - vec3_m_texCoord60coords.y,
1.0 - vec3_m_texCoord60coords.z
);
gl_FragColor = vec4(vec3_m_invert61inverted,0);
}
