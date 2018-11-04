
void main() {
vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
vec2 viewVector = iMouse.xy * 2.0 - 1.0;
vec3 vec3_m_texCoord60coords = vec3(texCoord,0);
vec3 vec3_m_invert61inverted = 1.0 - vec3_m_texCoord60coords;
gl_FragColor = vec4(vec3_m_invert61inverted,0);
}
