import { CGFobject } from '../lib/CGF.js';

export class MyFrustum extends CGFobject {
  // FRUSTUM -> piramide ou prisma "cortado" 

  /**
   * Constrói um frustum (pirâmide ou prisma cortado)
   * @param {CGFscene} scene
   * @param {number} slices       - divisoes
   * @param {number} height       - altura
   * @param {number} baseRadius   - raio base inferior
   * @param {number} topRadius    - raio base superior
   * @param {Array} tipOffset     - Deslocamento [dx, dy, dz] aplicado à base superior (padrão [0,0,0])
   * @param {boolean} hasTop      - para o balde, desenhar face interior;
   */
  constructor(scene, slices = 8, height = 1, baseRadius = 1, topRadius = 0.5, tipOffset = [0, 0, 0], hasTop = true) {
    super(scene);
    this.slices = slices;
    this.height = height;
    this.baseRadius = baseRadius;
    this.topRadius = topRadius;
    this.tipOffset = tipOffset;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];
  
    const angStep = 2 * Math.PI / this.slices;
    const [dx, dy, dz] = this.tipOffset;
  
    // ---------- LATERAIS ----------
    for (let i = 0; i < this.slices; i++) {
      const angle = i * angStep;
      const nextAngle = (i + 1) * angStep;
  
      const x1b = this.baseRadius * Math.cos(angle);
      const y1b = this.baseRadius * Math.sin(angle);
      const x2b = this.baseRadius * Math.cos(nextAngle);
      const y2b = this.baseRadius * Math.sin(nextAngle);
  
      const x1t = this.topRadius * Math.cos(angle) + dx;
      const y1t = this.topRadius * Math.sin(angle) + dy;
      const z1t = this.height + dz;
  
      const x2t = this.topRadius * Math.cos(nextAngle) + dx;
      const y2t = this.topRadius * Math.sin(nextAngle) + dy;
      const z2t = this.height + dz;
  
      const baseIndex = this.vertices.length / 3;
  
      // Face exterior
      this.vertices.push(
        x1b, y1b, 0,
        x1t, y1t, z1t,
        x2t, y2t, z2t,
        x2b, y2b, 0
      );
  
      // Normais exteriores
      const U = [x2b - x1b, y2b - y1b, 0];
      const V = [x2t - x1b, y2t - y1b, z2t];
      const nx = U[1] * V[2] - U[2] * V[1];
      const ny = U[2] * V[0] - U[0] * V[2];
      const nz = U[0] * V[1] - U[1] * V[0];
      const len = Math.hypot(nx, ny, nz);
      for (let j = 0; j < 4; j++) this.normals.push(nx / len, ny / len, nz / len);
  
      this.texCoords.push(
        i / this.slices, 1,
        i / this.slices, 0,
        (i + 1) / this.slices, 0,
        (i + 1) / this.slices, 1
      );
  
      this.indices.push(
        baseIndex, baseIndex + 3, baseIndex + 2,
        baseIndex, baseIndex + 2, baseIndex + 1
      );
  
      // Face interior (mesmas posições, normais invertidas, ordem invertida)
      const innerBaseIndex = this.vertices.length / 3;
  
      this.vertices.push(
        x1b, y1b, 0,
        x1t, y1t, z1t,
        x2t, y2t, z2t,
        x2b, y2b, 0
      );
  
      for (let j = 0; j < 4; j++) this.normals.push(-nx / len, -ny / len, -nz / len);
  
      this.texCoords.push(
        i / this.slices, 1,
        i / this.slices, 0,
        (i + 1) / this.slices, 0,
        (i + 1) / this.slices, 1
      );
  
      this.indices.push(
        innerBaseIndex, innerBaseIndex + 2, innerBaseIndex + 3,
        innerBaseIndex, innerBaseIndex + 1, innerBaseIndex + 2
      );
    }
  
    // topo
    if (this.hasTop) {
      const baseCenterIndex = this.vertices.length / 3;
      this.vertices.push(0, 0, 0);
      this.normals.push(0, 0, -1);
      this.texCoords.push(0.5, 0.5);
    
      for (let i = 0; i < this.slices; i++) {
        const angle = i * angStep;
        const x = this.baseRadius * Math.cos(angle);
        const y = this.baseRadius * Math.sin(angle);
        this.vertices.push(x, y, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5 + 0.25 * (x / this.baseRadius), 0.5 - 0.25 * (y / this.baseRadius));
    
        const idx1 = baseCenterIndex + 1 + i;
        const idx2 = baseCenterIndex + 1 + ((i + 1) % this.slices);
        this.indices.push(baseCenterIndex, idx2, idx1);
      }
    }
  
    // base
    let nxTop = 0, nyTop = 0, nzTop = 1;
    if (dx !== 0 || dy !== 0 || dz !== 0) {
      const topNormal = [-dx, -dy, this.height];
      const lenTop = Math.hypot(...topNormal);
      nxTop = topNormal[0] / lenTop;
      nyTop = topNormal[1] / lenTop;
      nzTop = topNormal[2] / lenTop;
    }

    const topCenterIndex = this.vertices.length / 3;
    this.vertices.push(dx, dy, this.height + dz);
    this.normals.push(nxTop, nyTop, nzTop);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i < this.slices; i++) {
      const angle = i * angStep;
      const x = this.topRadius * Math.cos(angle) + dx;
      const y = this.topRadius * Math.sin(angle) + dy;
      const z = this.height + dz;
      this.vertices.push(x, y, z);
      this.normals.push(nxTop, nyTop, nzTop);
      this.texCoords.push(
        0.5 - 0.10 * ((x - dx) / this.topRadius),
        0.5 + 0.10 * ((y - dy) / this.topRadius)
      );

      const idx1 = topCenterIndex + 1 + i;
      const idx2 = topCenterIndex + 1 + ((i + 1) % this.slices);
      this.indices.push(topCenterIndex, idx2, idx1);
    }

      const topCenterIndexInner = this.vertices.length / 3;
      this.vertices.push(dx, dy, this.height + dz);
      this.normals.push(-nxTop, -nyTop, -nzTop);
      this.texCoords.push(0.5, 0.5);

      for (let i = 0; i < this.slices; i++) {
        const angle = i * angStep;
        const x = this.topRadius * Math.cos(angle) + dx;
        const y = this.topRadius * Math.sin(angle) + dy;
        const z = this.height + dz;
        this.vertices.push(x, y, z);
        this.normals.push(-nxTop, -nyTop, -nzTop);
        this.texCoords.push(
          0.5 - 0.10 * ((x - dx) / this.topRadius),
          0.5 + 0.10 * ((y - dy) / this.topRadius)
        );

        const idx1 = topCenterIndexInner + 1 + i;
        const idx2 = topCenterIndexInner + 1 + ((i + 1) % this.slices);
        this.indices.push(topCenterIndexInner, idx1, idx2); // invertido
      }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
