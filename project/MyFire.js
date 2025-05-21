import { CGFobject } from "../lib/CGF.js";
import { MyFlame } from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene, numFlames = 10, maxHeight = 2.0, material = null, treeHeight = 6, fireheight = 0) {
    super(scene);
    this.numFlames = numFlames;
    this.maxHeight = maxHeight;
    this.material = material;
    this.treeHeight = treeHeight;
    this.flames = [];
    this.baseFlame = new MyFlame(scene);
    this.initFlames();
  }

  initFlames() {
    
  }

  display() {
    for (const flame of this.flames) {
      this.scene.pushMatrix();
      this.flame.drawFlame();
      this.scene.popMatrix();
    }
  }

  drawFlame() {
    this.baseFlame.display();
  }
}
