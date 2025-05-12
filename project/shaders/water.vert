precision mediump float;

attribute vec3 position;  
attribute vec2 texCoord;

uniform mat4 u_ModelViewProjectionMatrix;

varying vec2 v_texCoord;

void main() {
    gl_Position = u_ModelViewProjectionMatrix * vec4(position, 1.0);
    v_texCoord = texCoord;
}
