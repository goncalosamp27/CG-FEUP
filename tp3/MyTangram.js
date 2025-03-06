import { CGFobject } from "../lib/CGF.js";
import { CGFappearance } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./myTriangleSmall.js";
import { MyTriangleBig } from "./myTriangleBig.js";

export class MyTangram extends CGFobject {
  constructor(scene) {
    super(scene);
    
    // Criar as peças do Tangram
    this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);
    this.triangleSmall = new MyTriangleSmall(scene);
    this.triangleBig = new MyTriangleBig(scene);

    // Inicializar materiais corretamente
    this.initMaterials();
  }

  initMaterials() {  
    console.log("sim");

    this.materialBlue = new CGFappearance(this.scene);
    this.materialBlue.setAmbient(0.0, 0.0, 0.5, 1.0);
    this.materialBlue.setDiffuse(0.0, 0.0, 0.7, 1.0);
    this.materialBlue.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialBlue.setShininess(10.0);
    console.log("sim");

    this.materialPink = new CGFappearance(this.scene);
    this.materialPink.setAmbient(0.5, 0.0, 0.5, 1.0);
    this.materialPink.setDiffuse(0.7, 0.0, 0.7, 1.0);
    this.materialPink.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialPink.setShininess(10.0);

    this.materialRed = new CGFappearance(this.scene);
    this.materialRed.setAmbient(0.5, 0.0, 0.0, 1.0);
    this.materialRed.setDiffuse(0.7, 0.0, 0.0, 1.0);
    this.materialRed.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialRed.setShininess(10.0);
  
    this.materialOrange = new CGFappearance(this.scene);
    this.materialOrange.setAmbient(0.5, 0.3, 0.0, 1.0);
    this.materialOrange.setDiffuse(0.8, 0.4, 0.0, 1.0);
    this.materialOrange.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialOrange.setShininess(10.0);
  
    this.materialPurple = new CGFappearance(this.scene);
    this.materialPurple.setAmbient(0.3, 0.0, 0.5, 1.0);
    this.materialPurple.setDiffuse(0.5, 0.0, 0.8, 1.0);
    this.materialPurple.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialPurple.setShininess(100.0);
  
    this.materialYellow = new CGFappearance(this.scene);
    this.materialYellow.setAmbient(0.5, 0.5, 0.0, 1.0);
    this.materialYellow.setDiffuse(0.8, 0.8, 0.0, 1.0);
    this.materialYellow.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.materialYellow.setShininess(100.0);
  }
  
  display() {
    // quadrado (verde) (Material Custom da GUI)
    this.scene.pushMatrix();
    this.scene.translate(2.2, 1, 0);
    this.scene.rotate(Math.PI / 4, 0, 0, 1);
    this.scene.customMaterial.apply(); 
    this.diamond.display();
    this.scene.popMatrix();

    // Triângulo Azul
    this.scene.pushMatrix();
    this.scene.translate(-2.1, 1.3, 0);
    this.scene.rotate(Math.PI / 2, 0, 0, 1);
    this.scene.scale(1.3, 1.3, 1);
    this.materialBlue.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Triângulo Rosa
    this.scene.pushMatrix();
    this.scene.translate(0.5, 1.28, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.materialPink.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Triângulo Vermelho
    this.scene.pushMatrix();
    this.scene.translate(2.2, -0.4, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.scale(0.7, 0.7, 1);
    this.materialRed.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Triângulo Laranja
    this.scene.pushMatrix();
    this.scene.translate(-0.8, 0.6, 0);
    this.scene.rotate((3 * Math.PI) / 2, 0, 0, 1);
    this.materialOrange.apply();
    this.triangleBig.display();
    this.scene.popMatrix();

    // Triângulo Roxo
    this.scene.pushMatrix();
    this.scene.translate(-0.3, -1.9, 0);
    this.materialPurple.apply();
    this.triangleSmall.display();
    this.scene.popMatrix();

    // Paralelogramo Amarelo
    this.scene.pushMatrix();
    this.scene.translate(-3.5, -0.9, 0);
    this.scene.scale(0.9, 0.9, 1);
    this.materialYellow.apply();
    this.parallelogram.display();
    this.scene.popMatrix();
  }

  enableNormalViz() {
    this.diamond.enableNormalViz();
    this.triangle.enableNormalViz();
    this.triangleBig.enableNormalViz();
    this.triangleSmall.enableNormalViz();
    this.parallelogram.enableNormalViz();
  }

  disableNormalViz() {
    this.diamond.disableNormalViz();
    this.triangle.disableNormalViz();
    this.triangleBig.disableNormalViz();
    this.triangleSmall.disableNormalViz();
    this.parallelogram.disableNormalViz();
  }
}
