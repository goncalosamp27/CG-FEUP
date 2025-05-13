#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vWaveHeight;

uniform sampler2D uSampler;   
uniform sampler2D uSampler2;  

void main() {
    vec4 baseColor = texture2D(uSampler, vTextureCoord);
    vec4 distortion = texture2D(uSampler2, vTextureCoord);

    float blueFactor = clamp(distortion.b + 0.4, 0.0, 1.0);
    baseColor.rgb *= blueFactor;

    float lighting = 0.5 + 0.5 * vWaveHeight; 
    vec3 highlight = vec3(0.2, 0.4, 0.7) * lighting;

    vec3 finalColor = mix(baseColor.rgb, highlight, 0.3);

    gl_FragColor = vec4(finalColor, 0.85); 
}
