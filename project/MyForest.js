import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
	constructor(scene, rows = 5, cols = 4) {
		super(scene);

		this.rows = rows;
		this.cols = cols;
		this.spacing = 5;
		this.trees = [];

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const offsetX = (Math.random() - 0.5) * 1;
				const offsetZ = (Math.random() - 0.5) * 1;

				const height = 4 + Math.random() * 4; 
				const trunkRadius = 0.2 + Math.random() * 0.2; 
				const leanAngle = Math.random() * 10; 
				const leanAxis = Math.random() < 0.5 ? 'x' : 'z'; 

				const rand = Math.random();
				let id;
				if (rand < 0.7) id = 0;          
				else if (rand < 0.95) id = 1;     
				else id = 2;                      

				this.trees.push({
					tree: new MyTree(scene, {
						height,
						trunkRadius,
						leanAngle,
						leanAxis,
						id
					}),
					x: j * this.spacing + offsetX,
					z: i * this.spacing + offsetZ,
				});
			}
		}
	}

	display() {
		const camX = this.scene.camera.position[0];
		const camZ = this.scene.camera.position[2];
		this.trees.sort((a, b) => {
			const dA = (a.x - camX)**2 + (a.z - camZ)**2;
			const dB = (b.x - camX)**2 + (b.z - camZ)**2;
			return dB - dA; 
		});

	
		for (let { tree, x, z } of this.trees) {
			this.scene.pushMatrix();
			this.scene.translate(x, 0, z);
			tree.display();
			this.scene.popMatrix();
		}
	}
	
}
