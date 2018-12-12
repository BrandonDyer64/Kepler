
void main() {
vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
vec2 viewVector = iMouse.xy * 2.0 - 1.0;

gl_FragColor = vec4(,0);
}
