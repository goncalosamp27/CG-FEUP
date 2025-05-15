import { CGFobject } from "../lib/CGF.js";

export class MyFlame extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    const h = Math.sqrt(3) / 2;       
    const yBase = -h / 2;             
    const yTop = h / 2;

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
