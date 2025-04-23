import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
	constructor(scene, numLeaves = 3) {
		super(scene);

		this.scene = scene;
		this.numLeaves = numLeaves;

		this.trunkHeight = numLeaves * 1;
		this.trunkRadius = numLeaves * 0.25;

		const roll = Math.random();
		let type;
		if (roll < 0.05) type = "pink";      
		else if (roll < 0.30) type = "white"; 
		else type = "normal";

		// tronco
		this.trunkMaterial = new CGFappearance(scene);
		

		this.leafMaterial = new CGFappearance(scene);
		

		if (type === "normal") {
			this.trunkMaterial.setAmbient(0.4, 0.2, 0.05, 1);
			this.trunkMaterial.setDiffuse(0.4, 0.2, 0.05, 1);
	
			this.leafMaterial.setAmbient(0.1, 0.4, 0.1, 1);
			this.leafMaterial.setDiffuse(0.2, 0.6, 0.2, 1);
		}
		else if (type === "pink") {
			this.trunkMaterial.setAmbient(0.11, 0.059, 0.086, 1);
			this.trunkMaterial.setDiffuse(0.3, 0.059, 0.086, 1); 
	
			this.leafMaterial.setAmbient(1.0, 0.72, 0.835, 1);
			this.leafMaterial.setDiffuse(0.9, 0.6, 0.8, 1);
		}
		else if (type === "white") {
			this.trunkMaterial.setAmbient(0.902, 0.843, 0.706, 1);
			this.trunkMaterial.setDiffuse(0.95, 0.9, 0.75, 1);
		
			this.leafMaterial.setAmbient(0.196, 0.353, 0.196, 1);
			this.leafMaterial.setDiffuse(0.25, 0.45, 0.25, 1);
		}
		

		this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1);
		this.trunkMaterial.setShininess(10.0);
		this.leafMaterial.setSpecular(0.05, 0.05, 0.05, 1);
		this.leafMaterial.setShininess(10.0);
		

		this.trunk = new MyPyramid(scene, 20, 10, this.trunkHeight, this.trunkRadius);

		this.leaves = [];
		for (let i = 0; i < this.numLeaves; i++) {
			const leafHeight = 0.8 + 0.5 * (this.numLeaves - i);
			const leafRadius = 0.8 + 0.4 * (this.numLeaves - i);
			this.leaves.push(new MyPyramid(scene, 6, 1, leafHeight, leafRadius));
		}
	}

	display() {
		this.scene.pushMatrix();
		this.trunkMaterial.apply();
		this.trunk.display();
		this.scene.popMatrix();
	
		let currentY = this.trunkHeight/ 3;

		for (let i = 0; i < this.leaves.length; i++) {
			const leaf = this.leaves[i];
			this.scene.pushMatrix();
			this.scene.translate(0, currentY, 0);
			this.scene.rotate(Math.PI / (this.numLeaves) * i , 0, 1, 0); 
			this.leafMaterial.apply();
			leaf.display();
			this.scene.popMatrix();
			currentY += leaf.height * 0.7; // sobreposição natural
		}
	}
}
