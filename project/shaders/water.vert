#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
varying float vWaveHeight;

void main() {
    // 1) Anima as UVs exatamente como fazias antes
    vTextureCoord = aTextureCoord * 2.0
                  + vec2(timeFactor * 0.005, timeFactor * 0.005);

    // 2) Combinação de senos/cossenos para ondular em X/Y
    float wave = 
          0.05 * sin(timeFactor * 0.1 + aVertexPosition.x * 3.0 + aVertexPosition.y * 3.0)
        + 0.05 * cos(timeFactor * 0.13 + aVertexPosition.x * 5.0 - aVertexPosition.y * 2.5);

    // 3) Offset vertical extra
    float floatOffset = 0.002 * sin(timeFactor * 0.5);

    // 4) Envio para o fragment
    vWaveHeight = wave;

    // 5) Displacement final
    vec3 displaced = aVertexPosition + vec3(0.0, floatOffset, wave);
    gl_Position = uPMatrix * uMVMatrix * vec4(displaced, 1.0);
}
