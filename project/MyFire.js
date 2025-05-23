import { CGFobject } from "../lib/CGF.js";
import { MyFlame }     from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene      = scene;
    this.centerScale = 1.5;
    this.flames     = [];
    this.offsetAngle = Math.random() * 2 * Math.PI;
    this.initFlames();
  }

  initFlames() {
    const count = Math.floor(Math.random() * 6) + 1;

    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI / count) * i;
      this.flames.push({
        instance: new MyFlame(this.scene),
        angle,
        scale: 1,
        isCenter: false,
      });
    }

    [0, Math.PI / 2].forEach(angle => {
      this.flames.push({
        instance: new MyFlame(this.scene),
        angle,
        scale: this.centerScale,
        isCenter: true,
      });
    });
  }
  display() {
    const radius = -0.5;

    for (const { instance, angle, scale, isCenter } of this.flames) {
        this.scene.pushMatrix();

        if (!isCenter) {
            this.scene.rotate(angle + this.offsetAngle, 0, 1, 0);
            this.scene.translate(radius, 0, 0);
        } else {
            this.scene.rotate(angle, 0, 1, 0);
        }

        this.scene.scale(scale, scale, scale);
        instance.display();

        this.scene.popMatrix();
    }
  }
}