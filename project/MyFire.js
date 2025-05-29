import { CGFobject } from "../lib/CGF.js";
import { MyFlame }     from "./MyFlame.js";

export class MyFire extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene      = scene;
    this.centerScale = 1.5; // escala das chamas centrais (maior que as outras)
    this.flames     = []; // array de chamas
    this.offsetAngle = Math.random() * 2 * Math.PI; // angulo aleatorio que roda o fogo
    this.initFlames(); // popular array de chamas

    this.creationTime = this.scene.time; 
    this.growthDuration = 500 + Math.random() * 2000; // tempo a acender

    this.isExtinguishing = false;
    this.extinguishStartTime = null;
    this.extinguishDuration = 500 + Math.random() * 2000; // tempo a apagar
  }

  initFlames() {
    /*
      gerar random flames, se for central a escala é maior
      as 2 centrais fazem 90º uma com a outra
      as restantes ficam a volta das centrais com um angulo de 360 / nº chamas, para ficarem equidistantes
    */
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
  // display das chamas controlados pelo tempo de crescimento e de apagão
  display(currentTime) {
    const growthScale = this.getCurrentScale(currentTime);
    const radius = -0.5;

    for (const { instance, angle, scale, isCenter } of this.flames) {
      this.scene.pushMatrix();

      if (!isCenter) {
        this.scene.rotate(angle + this.offsetAngle, 0, 1, 0);
        this.scene.translate(radius, 0, 0);
      } else {
        this.scene.rotate(angle, 0, 1, 0);
      }

      // Aplica crescimento gradual
      const finalScale = growthScale * scale;
      this.scene.scale(finalScale, finalScale, finalScale);

      instance.display(currentTime); // se precisares do tempo para animação interna
      this.scene.popMatrix();
    }
  }

  getCurrentScale(currentTime) {
    const elapsed = currentTime - this.creationTime;

    if (!this.isExtinguishing) {
      const growthProgress = Math.min(elapsed / this.growthDuration, 1.0);
      return growthProgress;
    } 
    else {
      const fadeElapsed = currentTime - this.extinguishStartTime;
      const fadeProgress = Math.min(fadeElapsed / this.extinguishDuration, 1.0);
      return Math.max(1.0 - fadeProgress, 0);
    }
  }

  // para apagar as chamas
  startExtinguish(currentTime) {
    this.isExtinguishing = true;
    this.extinguishStartTime = currentTime;
  }
}