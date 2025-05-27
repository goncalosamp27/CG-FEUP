#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vWaveHeight;

uniform sampler2D uSampler;   
uniform sampler2D uSampler2;  
uniform float timeFactor;

void main() {
    float tileNormal = 1.0;  
    float tileColor  = 1.5;   
    float strength   = 0.01;  

    vec2 uvMap = vTextureCoord * tileNormal+ vec2(timeFactor * 0.08, timeFactor * 0.06);

    float height = texture2D(uSampler2, uvMap).r;

    vec2 distortion = (height - 0.5) * vec2(strength);

    vec2 uvColor = vTextureCoord * tileColor + distortion;

    vec4 baseColor = texture2D(uSampler, uvColor);
    float light = 0.6 + 0.4 * vWaveHeight;
    vec3 highlight = vec3(0.2, 0.4, 0.7) * light;

    vec3 finalColor = mix(baseColor.rgb, highlight, 0.3);
    gl_FragColor = vec4(finalColor, baseColor.a * 0.9);
}
