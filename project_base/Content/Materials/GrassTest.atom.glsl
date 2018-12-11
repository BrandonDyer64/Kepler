float sigmoid(float x) {
if (x >= 1.0) return 1.0;
else if (x <= -1.0) return 0.0;
else return 0.5 + x * (1.0 - abs(x) * 0.5);
}
void main() {
vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
vec2 viewVector = iMouse.xy * 2.0 - 1.0;
float float_m_sigmoid73out = sigmoid();
gl_FragColor = vec4(,0);
}
