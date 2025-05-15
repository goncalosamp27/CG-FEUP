import { CGFobject } from "../lib/CGF.js";
import { MyFlame } from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene, numFlames = 10, maxHeight = 2.0, material = null, treeHeight = 6) {
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
    this.flames = [];

    const minY = this.treeHeight * 0.6;
    const maxY = this.treeHeight * 0.95;

    const minRadius = 0.1;
    const maxRadius = 1.3;

    // ângulos fixos: 0, 120°, 240°
    const baseAngles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];

    for (let i = 0; i < this.numFlames; i++) {
      // Verticalmente espaçados proporcionalmente
      const yOffset = minY + (i / this.numFlames + Math.random() * 0.1) * (maxY - minY);

      // Ângulo de rotação: 0, 120, 240, repetido ciclicamente
      const angleIndex = i % 3;
      const rotation = baseAngles[angleIndex];

      // Raio com alguma aleatoriedade para afastamento
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const baseX = Math.cos(rotation) * radius;
      const baseZ = Math.sin(rotation) * radius;

      // Altura e largura proporcionais
      const height = 0.4 + Math.random() * this.maxHeight;
      const width = height * (0.8 + Math.random() * 0.3);

      this.flames.push({
        baseX,
        baseZ,
        yOffset,
        height,
        width,
        rotation
      });
    }
  }

  display() {
    if (this.material) this.material.apply();

    const cam = this.scene.camera.position;
    this.flames.sort((a, b) => {
      const distA = (a.baseX - cam[0]) ** 2 + (a.yOffset - cam[1]) ** 2 + (a.baseZ - cam[2]) ** 2;
      const distB = (b.baseX - cam[0]) ** 2 + (b.yOffset - cam[1]) ** 2 + (b.baseZ - cam[2]) ** 2;
      return distB - distA; // ordem decrescente
    });

    for (const flame of this.flames) {
      this.scene.pushMatrix();
      this.scene.translate(flame.baseX, flame.yOffset - 1, flame.baseZ);
      this.scene.rotate(flame.rotation, 0, 1, 0);
      this.scene.scale(flame.width * 0.6, flame.height * 0.7, 1);
      this.drawFlame();
      this.scene.popMatrix();
    }
  }

  drawFlame() {
    this.baseFlame.display();
  }
}
