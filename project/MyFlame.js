import { CGFobject } from "../lib/CGF.js";

export class MyFlame extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    const h = Math.sqrt(3) / 2;       // altura do triângulo equilátero (≈ 0.866)
    const yBase = -h / 2;             // base centrada na origem
    const yTop = h / 2;

    this.vertices = [
      // Frente
      0.0, yTop, 0.0,     
     -0.5, yBase, 0.0,    
      0.5, yBase, 0.0,   

      0.0, yTop, 0.0,
     -0.5, yBase, 0.0,
      0.5, yBase, 0.0,
    ];

    this.indices = [
      0, 1, 2, 
      5, 4, 3   
    ];

    this.normals = [

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    ];

    this.texCoords = [
      0.5, 0.0,   // topo
      0.0, 1.0,   // canto esquerdo
      1.0, 1.0,   // canto direito

      0.5, 0.0,
      0.0, 1.0,
      1.0, 1.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
