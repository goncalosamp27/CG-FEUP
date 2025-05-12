import { CGFobject } from '../lib/CGF.js';

export class MyBlade extends CGFobject {
  constructor(scene, baseWidth = 0.8, topWidth = 1.5, height = 0.2, length = 15) {
    super(scene);
    this.baseWidth = baseWidth;
    this.topWidth = topWidth;
    this.height = height;
    this.length = length;
    this.initBuffers();
  }

  initBuffers() {
    const b = this.baseWidth / 2;
    const t = this.topWidth / 2;
    const h = this.height;
    const l = this.length;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // --- Front face (Z+)
    this.vertices.push(-b, 0, 0, b, 0, 0, -t, h, l, t, h, l);
    this.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
    this.indices.push(0, 1, 2, 2, 1, 3);

    // --- Back face (Z−)
    const offset = 4;
    this.vertices.push(-b, 0, 0, b, 0, 0, -t, h, l, t, h, l);
    this.normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
    this.indices.push(offset + 2, offset + 1, offset + 0, offset + 2, offset + 3, offset + 1);

    // --- Bottom face (Y−)
    const offset2 = 8;
    this.vertices.push(-b, 0, 0, b, 0, 0, -b, 0, 0, b, 0, 0);
    this.normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
    this.indices.push(offset2, offset2 + 2, offset2 + 3, offset2, offset2 + 3, offset2 + 1);

    // --- Top face (Y+)
    const offset3 = 12;
    this.vertices.push(-t, h, l, t, h, l, -t, h, l, t, h, l);
    this.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
    this.indices.push(offset3, offset3 + 1, offset3 + 3, offset3, offset3 + 3, offset3 + 2);

    const offset4 = 16;
    const leftA = [-b, 0, 0];
    const leftB = [-t, h, l];
    const leftC = [-b, 0, 0]; // mesmo ponto repetido para o produto vetorial

    const UL = [leftB[0] - leftA[0], leftB[1] - leftA[1], leftB[2] - leftA[2]];
    const VL = [leftC[0] - leftA[0], leftC[1] - leftA[1], leftC[2] - leftA[2]];
    const nL = [
      UL[1] * VL[2] - UL[2] * VL[1],
      UL[2] * VL[0] - UL[0] * VL[2],
      UL[0] * VL[1] - UL[1] * VL[0]
    ];
    const lenL = Math.hypot(...nL);
    const normalL = nL.map(n => n / lenL);

    this.vertices.push(...leftA, ...leftB, ...leftC, ...leftB); // repetido para ter 4 vértices
    for (let i = 0; i < 4; i++) this.normals.push(...normalL);
    this.indices.push(offset4, offset4 + 1, offset4 + 3, offset4, offset4 + 3, offset4 + 2);


    // --- Right face (X+)
    const offset5 = 20;
    const rightA = [b, 0, 0];
    const rightB = [t, h, l];
    const rightC = [b, 0, 0];

    const UR = [rightB[0] - rightA[0], rightB[1] - rightA[1], rightB[2] - rightA[2]];
    const VR = [rightC[0] - rightA[0], rightC[1] - rightA[1], rightC[2] - rightA[2]];
    const nR = [
      UR[1] * VR[2] - UR[2] * VR[1],
      UR[2] * VR[0] - UR[0] * VR[2],
      UR[0] * VR[1] - UR[1] * VR[0]
    ];
    const lenR = Math.hypot(...nR);
    const normalR = nR.map(n => n / lenR);

    this.vertices.push(...rightA, ...rightB, ...rightC, ...rightB);
    for (let i = 0; i < 4; i++) this.normals.push(...normalR);
    this.indices.push(offset5, offset5 + 3, offset5 + 1, offset5, offset5 + 1, offset5 + 2);


    this.texCoords = [
      // Front face
      0, 0,   1, 0,   0, 1,   1, 1,
    
      // Back face
      0, 0,   1, 0,   0, 1,   1, 1,
    
      // Bottom face
      0, 0,   1, 0,   0, 1,   1, 1,
    
      // Top face
      0, 0,   1, 0,   0, 1,   1, 1,
    
      // Left face
      0, 0,   1, 0,   0, 1,   1, 1,
    
      // Right face
      0, 0,   1, 0,   0, 1,   1, 1
    ];
    

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
