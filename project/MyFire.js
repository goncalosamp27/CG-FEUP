import { CGFobject } from "../lib/CGF.js";
import { MyFlame }     from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene, material = null, fireHeight = 0, radius = 1) {
    super(scene);
    this.scene      = scene;
    this.material   = material;
    this.fireHeight = fireHeight;
    this.radius     = radius;
    this.centerScale = 1.5;
    this.flames     = [];
    this.initFlames();
  }

  initFlames() {
    if (this.fireHeight === 0) {
      const count = Math.floor(Math.random() * 6) + 1;
      for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI / count) * i;
        this.flames.push({
          instance: new MyFlame(this.scene),
          angle,
          height: 0,
          scale: 1.0,
          isCenter: false
        });
      }
      [0, Math.PI / 2].forEach(angle => {
        this.flames.push({
          instance: new MyFlame(this.scene),
          angle,
          height: 0,
          scale: this.centerScale,
          isCenter: true
        });
      });
    } else {
      const maxCount = Math.floor(this.fireHeight) || 1;
      const count    = Math.floor(Math.random() * maxCount) + 1;
      for (let i = 0; i < count; i++) {
        this.flames.push({
          instance: new MyFlame(this.scene),
          angle:  Math.random() * 2 * Math.PI,
          height: Math.random() * this.fireHeight, 
          scale:  1.0,
          isCenter: false
        });
      }
    }
  }

  display() {
    if (this.material) this.material.apply();

    for (const { instance, angle, height, scale, isCenter } of this.flames) {
      this.scene.pushMatrix();

      const x = this.radius * Math.cos(angle);
      const z = this.radius * Math.sin(angle);
      this.scene.translate(x, height, z);

      this.scene.rotate(angle + (isCenter ? 0 : Math.PI / 2), 0, 1, 0);

      this.scene.scale(scale, scale, scale);
      instance.display();

      this.scene.popMatrix();
    }
  }
}