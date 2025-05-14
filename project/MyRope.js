import { CGFobject } from '../lib/CGF.js';
import { MyPrism } from './MyPrism.js';

export class MyRope extends CGFobject {
  constructor(scene) {
    super(scene);
    this.slices = 12;
    this.cylinder = new MyPrism(scene, this.slices, 0.2, 0.2);
  }

  display(start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length === 0) return;

    const dir = [dx / length, dy / length, dz / length];
    const angle = Math.acos(dir[1]);
    const rotAxis = [dir[2], 0, -dir[0]];

    const axisLength = Math.hypot(...rotAxis);
    const axis = axisLength === 0 ? [1, 0, 0] : rotAxis.map(v => v / axisLength);

    this.scene.pushMatrix();
    this.scene.translate(...start);
    this.scene.rotate(angle, ...axis);
    this.scene.scale(1, length, 1);
    this.cylinder.display();
    this.scene.popMatrix();
  }
}
