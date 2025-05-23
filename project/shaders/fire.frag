#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
    vec2 uv = vTextureCoord;

    uv.x += 0.015 * sin(timeFactor * 1.0 + uv.y * 8.0);
    uv.y += 0.01 * cos(timeFactor * 1.3 + uv.x * 5.0);

    vec4 texColor = texture2D(uSampler, uv);

    gl_FragColor = texColor;
}
