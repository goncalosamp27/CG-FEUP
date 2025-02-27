import { CGFobject } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

export class MyTangram extends CGFobject {
  constructor(scene) {
    super(scene);
    this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);
    this.triangleSmall = new MyTriangleSmall(scene);
    this.triangleBig = new MyTriangleBig(scene);
  }

  display() {
    const scene = this.scene;

    // quadrado (verde)
    scene.pushMatrix();
    scene.translate(2.2, 1, 0);
    scene.rotate(Math.PI / 4, 0, 0, 1);
    scene.setDiffuse(0, 1, 0, 1);
    this.diamond.display();
    scene.popMatrix();

    // triângulo azul
    scene.pushMatrix();
    scene.translate(-2.1, 1.3, 0);
    scene.rotate(Math.PI / 2, 0, 0, 1);
    scene.scale(1.3, 1.3, 1);
    scene.setDiffuse(0, 157 / 255, 1, 1);
    this.triangle.display();
    scene.popMatrix();

    // triângulo rosa
    scene.pushMatrix();
    scene.translate(0.5, 1.28, 0);
    scene.rotate(Math.PI, 0, 0, 1);
    scene.setDiffuse(1, 157 / 255, 211 / 255, 1);
    this.triangle.display();
    scene.popMatrix();

    // triângulo vermelho
    scene.pushMatrix();
    scene.translate(2.2, -0.4, 0);
    scene.rotate(Math.PI, 0, 0, 1);
    scene.scale(0.7, 0.7, 1);
    scene.setDiffuse(1, 12 / 255, 12 / 255, 1);
    this.triangle.display();
    scene.popMatrix();

    // triângulo laranja
    scene.pushMatrix();
    scene.translate(-0.8, 0.6, 0);
    scene.rotate((3 * Math.PI) / 2, 0, 0, 1);
    scene.setDiffuse(1, 157 / 255, 0, 1);
    this.triangleBig.display();
    scene.popMatrix();

    // triângulo roxo
    scene.pushMatrix();
    scene.translate(-0.3, -1.9, 0);
    scene.setDiffuse(171 / 255, 78 / 255, 195 / 255, 1);
    this.triangleSmall.display();
    scene.popMatrix();

    // paralelogramo amarelo
    scene.pushMatrix();
    scene.translate(-3.5, -0.9, 0);
    scene.scale(0.9, 0.9, 1);
    scene.setDiffuse(1, 1, 0, 1);
    this.parallelogram.display();
    scene.popMatrix();
  }
}
