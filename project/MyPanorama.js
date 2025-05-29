import { CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama extends CGFobject {
	constructor(scene, appearance) {
		super(scene);
		this.material = appearance;
		this.sphere = new MySphere(scene, 200, 50, 50, true); // criar a esfera, valor true adiciona normais internas
	}

	display() {
		this.scene.pushMatrix();
		
		if (this.scene.followPanorama) { // para o panorama direcionar a camara, ficar centrado
			const camPos = this.scene.camera.position;  
			this.scene.translate(camPos[0], camPos[1], camPos[2]);
		}
		
		this.material.apply();
		this.scene.gl.disable(this.scene.gl.CULL_FACE);
		this.sphere.display();
		this.scene.gl.enable(this.scene.gl.CULL_FACE);

		this.scene.popMatrix();
  	}
}
