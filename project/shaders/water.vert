attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D uSampler2;
uniform float timeFactor;

varying vec2 vTextureCoord;
varying float vWaveHeight;

void main() {
    vTextureCoord = aTextureCoord * 2.0 + vec2(timeFactor * 0.005, timeFactor * 0.005);

    float wave = 0.05 * sin(timeFactor * 0.1 + aVertexPosition.x * 3.0 + aVertexPosition.y * 3.0)
               + 0.05 * cos(timeFactor * 0.13 + aVertexPosition.x * 5.0 - aVertexPosition.y * 2.5);

    float floatOffset = 0.002 * sin(timeFactor * 0.5);

    vWaveHeight = wave;

    vec3 offset = vec3(0.0, floatOffset, wave);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
