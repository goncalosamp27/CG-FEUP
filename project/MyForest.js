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


				const baseGreen = 0.4 + Math.random() * 0.3; 
				const red = 0.1 + Math.random() * 0.2;
				const blue = 0.1 + Math.random() * 0.2;
				const leafColor = [red, baseGreen, blue];

				this.trees.push({
					tree: new MyTree(scene, {
						height,
						trunkRadius,
						leanAngle,
						leanAxis,
						leafColor
					}),
					x: j * this.spacing + offsetX,
					z: i * this.spacing + offsetZ,
				});
			}
		}
	}

	display() {
		for (let { tree, x, z } of this.trees) {
			this.scene.pushMatrix();
			this.scene.translate(x, 0, z);
			tree.display();
			this.scene.popMatrix();
		}
	}
}
