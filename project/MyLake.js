import { CGFobject } from "../lib/CGF.js";

export class MyLake extends CGFobject {
  constructor(scene, radius, positionY = 0.1, slices = 128) {
    super(scene);
    this.radius = radius;
    this.positionY = positionY;
    this.slices = slices;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // Centro do círculo
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i <= this.slices; i++) {
      const angle = i * 2 * Math.PI / this.slices;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
    
      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
    
      // Coordenadas de textura suaves (de forma radial)
      let u = 0.5 + 0.5 * x;
      let v = 0.5 + 0.5 * y;
      this.texCoords.push(u, v);
    }
    

    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.scene.pushMatrix();

    this.scene.translate(0, this.positionY, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Para XZ
    this.scene.scale(this.radius, this.radius, 1); // Aplica o raio

    super.display();

    this.scene.popMatrix();
  }
}
