attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float cloudOffset;  

varying vec2 vTextureCoord;
varying vec2 vCloudTexCoord;

void main() {
    vTextureCoord = aTextureCoord;
    vCloudTexCoord = aTextureCoord + vec2(0.0, cloudOffset);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
