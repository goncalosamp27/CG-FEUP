import { CGFobject } from '../lib/CGF.js';
import { MyPrism }    from './MyPrism.js';

export class MyRope extends CGFobject {
  constructor(scene, x1, y1, z1, x2, y2, z2, slices = 8, radius = 0.2) {
    super(scene);
    this.slices = slices;
    this.radius = radius;
    this.setEndpoints(x1,y1,z1, x2,y2,z2);
  }

  setEndpoints(x1, y1, z1, x2, y2, z2) {
    this.p1 = { x: x1, y: y1, z: z1 };
    this.p2 = { x: x2, y: y2, z: z2 };
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    this.length = Math.hypot(dx, dy, dz);
    this.angle  = this.length>0 ? Math.acos(dz/this.length) : 0;
    let ax = -dy, ay = dx, az = 0;
    const al = Math.hypot(ax,ay,az);
    if (al>1e-6) ax/=al, ay/=al, az/=al;
    this.axis = { x: ax, y: ay, z: az };
    this.prism = new MyPrism(this.scene, this.slices, this.length, this.radius);
  }

  display() {
    this.scene.pushMatrix();
      this.scene.translate(this.p1.x, this.p1.y, this.p1.z);
      if (this.angle > 1e-3)
        this.scene.rotate(this.angle, this.axis.x, this.axis.y, this.axis.z);
      this.prism.display();
    this.scene.popMatrix();
  }
}
