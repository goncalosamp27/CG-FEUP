import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js'; 

export class MyWindow extends CGFobject {
  // JANELA NO PLANO COM TEXTURA
  constructor(scene, width = 1, height = 1, appearance) {
    super(scene);

    this.width = width;
    this.height = height;
    this.plane = new MyPlane(scene, 10);

    this.appearance = appearance;
  }

  display() {
    this.scene.pushMatrix();
    this.appearance.apply();
    this.plane.display(); 
    this.scene.popMatrix();
  }
}

