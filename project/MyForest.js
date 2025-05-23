import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
	constructor(scene, rows = 5, cols = 4, spacing = 3.5) {
		super(scene);
		this.scene = scene;

		this.rows = rows;
		this.cols = cols;
		this.spacing = spacing;
		this.trees = [];

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const jitter = this.spacing * 0.5;
				const offsetX = (Math.random() - 0.5) * jitter;
				const offsetZ = (Math.random() - 0.5) * jitter;

				const height = 4 + Math.random() * 4; 
				const trunkRadius = 0.2 + Math.random() * 0.2; 
				const leanAngle = Math.random() * 10; 
				const leanAxis = Math.random() < 0.5 ? 'x' : 'z'; 

				const rand = Math.random();
				let id;
				if (rand < 0.7) id = 0;          
				else if (rand < 0.95) id = 1;     
				else id = 2;   
				
				let baseColor;
				if (id === 0) baseColor = [0.9, 0.9, 0.9];     
				else if (id === 1) baseColor = [0.6, 0.8, 0.6]; 
				else baseColor = [0.7, 0.4, 0.1];
				
				let leafColor = this.varyColor(baseColor, 0.1);

				const textures = this.scene.treeTextures[id];

				this.trees.push({
					tree: new MyTree(scene, {
						height,
						trunkRadius,
						leanAngle,
						leanAxis,
						leafColor,
						trunkMaterial: textures.wood,
						leafMaterial: textures.leaves
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

		this.scene.setActiveShaderSimple(this.scene.fireShader);
		this.scene.gl.activeTexture(this.scene.gl.TEXTURE1);
		this.scene.fireTexture.bind(1);
		this.scene.fireShader.setUniformsValues({ uSampler: 1 });

		for (let { tree, x, z } of this.trees) {
			if (tree.hasFire && tree.fire) {
				this.scene.pushMatrix();
				this.scene.translate(x + tree.fire.offsetX, -0.1, z + tree.fire.offsetZ);
				this.scene.rotate(tree.fire.rotationAngle, 0, 1, 0);
				this.scene.scale(1.2 * tree.fire.scaleFire, 1.4 * tree.fire.scaleFire, 0.8 * tree.fire.scaleFire);
				tree.fire.display();
				this.scene.popMatrix();
			}
		}

		this.scene.setActiveShaderSimple(this.scene.defaultShader);

	
		for (let { tree, x, z } of this.trees) {
			this.scene.pushMatrix();
			this.scene.translate(x, 0, z);
			tree.display();
			this.scene.popMatrix();
		}

		
	}

	varyColor(baseColor, jitter = 0.1) {
		return baseColor.map(c => {
		  let variation = (Math.random() - 0.5) * 2 * jitter; 
		  let value = c + variation;
		  return Math.min(1.0, Math.max(0.0, value)); 
		});
	}
}
