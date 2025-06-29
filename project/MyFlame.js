import { CGFobject } from "../lib/CGF.js";

export class MyFlame extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  // a chama é um triangulo equilatero na vertical
  // adaptar depois consoante scales
  initBuffers() {
    const h = Math.sqrt(3) / 2;       
    const yBase = 0;             
    const yTop = h;

    this.vertices = [
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
      0.5, 0.0,   
      0.0, 1.0,   
      1.0, 1.0,   

      0.5, 0.0,
      0.0, 1.0,
      1.0, 1.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
