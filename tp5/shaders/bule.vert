attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float normScale;
uniform float timeFactor;

varying vec4 vPosition;
varying vec2 vTextureCoord;

void main() {
    float offset = sin(timeFactor) * normScale;

    vec4 finalPosition = vec4(aVertexPosition.x + offset, aVertexPosition.y, aVertexPosition.z, 1.0);
    vPosition = uPMatrix * uMVMatrix * finalPosition;
    gl_Position = vPosition;
    
    vTextureCoord = aTextureCoord;
}