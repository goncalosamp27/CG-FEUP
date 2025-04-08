import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama extends CGFobject {
	constructor(scene, appearance) {
		super(scene);
		this.material = appearance;
		this.sphere = new MySphere(scene, 200, 50, 50, true);
	}

	display() {
		const camPos = this.scene.camera.position;
	
		this.scene.pushMatrix();
		this.scene.translate(camPos[0], camPos[1], camPos[2]); 
		this.material.apply();
		this.sphere.display();
		this.scene.popMatrix();
	}	
}
