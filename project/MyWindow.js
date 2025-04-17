import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js'; 

export class MyWindow extends CGFobject {
  constructor(scene, width = 1, height = 1, texturePath = null) {
    super(scene);

    this.width = width;
    this.height = height;

    this.quad = new MyQuad(scene);

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
    this.scene.scale(this.width, this.height, 1); 

    this.appearance.apply();

    this.quad.display();

    this.scene.popMatrix();
  }
}
