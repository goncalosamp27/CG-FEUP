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
      mod(vCloudTexCoord.x + timeFactor * 0.0005, 1.0),
      vCloudTexCoord.y
    );
    vec4 cloudColor = texture2D(uSampler2, uvCloud);

    float a = cloudColor.r;

    float horizon     = 0.1;  
    float fadeRange   = 0.10; 

    float fade = smoothstep(horizon - fadeRange*0.5,horizon + fadeRange*0.5,vTextureCoord.y);

    float alpha = a * fade;

    if (alpha < 0.01) {
        gl_FragColor = baseColor;
    } else {
        gl_FragColor = mix(baseColor, vec4(cloudColor.rgb, 1.0), alpha);
    }
}
