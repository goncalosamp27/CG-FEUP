attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vTextureCoord = aTextureCoord;

    float randomSeed = rand(aTextureCoord);

    float horizontalWave = 0.03 * sin(timeFactor * 1.5 + aVertexPosition.y * 5.0 + randomSeed * 6.28);

    float verticalWave = 0.02 * sin(timeFactor * 2.0 + aVertexPosition.x * 3.0 + randomSeed * 3.14);

    vec3 displacedPosition = aVertexPosition + vec3(horizontalWave, verticalWave, 0.0);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}
