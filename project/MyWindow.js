import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js'; 

export class MyWindow extends CGFobject {
  constructor(scene, width = 1, height = 1, texturePath = null) {
    super(scene);

    this.width = width;
    this.height = height;

    this.plane = new MyPlane(scene, 10); 

    this.appearance = new CGFappearance(scene);
    if (texturePath) {
      this.appearance.loadTexture(texturePath);
      this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.appearance.setShininess(10.0);
  }

  display() {
    this.scene.pushMatrix();

    this.appearance.apply();

    this.plane.display(); 
    this.scene.popMatrix();
  }
}
