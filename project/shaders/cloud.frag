#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec2 vCloudTexCoord;

uniform sampler2D uSampler;   
uniform sampler2D uSampler2;  
uniform float timeFactor;     

void main() {
    vec4 baseColor = texture2D(uSampler, vTextureCoord);
    
    vec2 uvCloud = vec2(
        mod(vCloudTexCoord.x + timeFactor * 0.002, 1.0),
        mod(vCloudTexCoord.y, 1.0)
    );
    vec4 cloudColor = texture2D(uSampler2, uvCloud);
    
    vec4 finalColor;
    if (cloudColor.b >= 0.2) {
        finalColor = mix(baseColor, cloudColor, cloudColor.b);
    } else {
        finalColor = baseColor;
    }
    gl_FragColor = finalColor;
}
