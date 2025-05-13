import { CGFobject } from "../lib/CGF.js";
import { MyFlame } from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene, numFlames = 10, maxHeight = 2.0, material = null) {
    super(scene);
    this.numFlames = numFlames;
    this.maxHeight = maxHeight;
    this.material = material;
    this.flames = [];
    this.baseFlame = new MyFlame(scene);
    this.initFlames();
  }

  initFlames() {
    for (let i = 0; i < this.numFlames; i++) {
      const verticalPosition = Math.random(); 
      const yOffset = verticalPosition * 4;
  
      const height = 0.4 + Math.random() * this.maxHeight;
      const width = height * (0.8 + Math.random() * 0.3);
  
      const radius = 0.1 + (1 - verticalPosition) * 0.6; 
      const angle = Math.random() * Math.PI * 2;
  
      const baseX = Math.cos(angle) * radius;
      const baseZ = Math.sin(angle) * radius;
  
      // Inclinação: vetor que aponta para fora da árvore
      const tiltStrength = 0.2; // controla o grau de inclinação (ajustável)
      const tiltX = baseX * tiltStrength;
      const tiltZ = baseZ * tiltStrength;
  
      this.flames.push({
        baseX,
        baseZ,
        yOffset,
        height,
        width,
        rotation: angle,
        tiltX,
        tiltZ
      });
    }
  }
  
  

  display() {
    if (this.material) this.material.apply();
  
    this.scene.gl.enable(this.scene.gl.BLEND);
    this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
    this.scene.gl.depthMask(false); // Desativa escrita no Z-buffer
  
    const cam = this.scene.camera.position;
    this.flames.sort((a, b) => {
      const distA = (a.baseX - cam[0]) ** 2 + (a.yOffset - cam[1]) ** 2 + (a.baseZ - cam[2]) ** 2;
      const distB = (b.baseX - cam[0]) ** 2 + (b.yOffset - cam[1]) ** 2 + (b.baseZ - cam[2]) ** 2;
      return distB - distA; // ordem decrescente
    });
  
    for (const flame of this.flames) {
      this.scene.pushMatrix();
      this.scene.translate(flame.baseX, flame.yOffset, flame.baseZ);
  
      // Inclinação da chama (segue a copa cónica)
      this.scene.rotate(flame.tiltX, 1, 0, 0);
      this.scene.rotate(flame.tiltZ, 0, 0, 1);
  
      this.scene.rotate(flame.rotation, 0, 1, 0);
      this.scene.scale(flame.width * 0.6, flame.height * 0.7, 1);
  
      this.drawFlame();
      this.scene.popMatrix();
    }
  
    // Repor estado gráfico
    this.scene.gl.depthMask(true);
    this.scene.gl.disable(this.scene.gl.BLEND);
  }
  
  drawFlame() {
    this.baseFlame.display();
  }
}
