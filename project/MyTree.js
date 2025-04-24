import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
	constructor(scene, {
		height = 6,
		trunkRadius = 0.7,
		leanAngle = 0,
		leanAxis = 'x',
		id = 0,
	}) 

	{
		super(scene);

		this.scene = scene;
		this.height = height;
		this.trunkRadius = trunkRadius * 2;
		this.leanAngle = leanAngle * Math.PI / 180;
		this.leanAxis = leanAxis;

		this.trunkHeight = height * 0.7;
		this.canopyHeight = height - 0.4*this.trunkHeight;
		this.numLeaves = Math.round(this.canopyHeight);

		const texturePairs = [
			{ wood: 'textures/wood1.png', leaves: 'textures/leaves1.png' },
			{ wood: 'textures/wood2.png', leaves: 'textures/leaves2.png' },
			{ wood: 'textures/wood3.png', leaves: 'textures/leaves3.png' }
		];

		const chosenTextures = texturePairs[id % texturePairs.length];

		this.trunkMaterial = new CGFappearance(scene);
		this.trunkMaterial.setAmbient(1, 1, 1, 1);
		this.trunkMaterial.setDiffuse(1, 1, 1, 1);
		this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1);
		this.trunkMaterial.setShininess(10.0);
		this.trunkMaterial.loadTexture(chosenTextures.wood);
		this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');

		this.leafMaterial = new CGFappearance(scene);
		this.leafMaterial.setAmbient(1, 1, 1, 1);
		this.leafMaterial.setDiffuse(1, 1, 1, 1);
		this.leafMaterial.setSpecular(0.1, 0.1, 0.1, 1);
		this.leafMaterial.setShininess(10.0);
		this.leafMaterial.loadTexture(chosenTextures.leaves);
		this.leafMaterial.setTextureWrap('REPEAT', 'REPEAT');

		this.trunk = new MyPyramid(scene, 7, 10, this.trunkHeight, this.trunkRadius);

		this.leaves = [];
		for (let i = 0; i < this.numLeaves; i++) {
			const leafHeight = this.canopyHeight / this.numLeaves;
			const leafRadius = this.trunkRadius + (this.numLeaves - i) * 0.2;
			this.leaves.push(new MyPyramid(scene, 6, 1, leafHeight, leafRadius));
		}
	}

	display() {
		this.scene.pushMatrix();

		if (this.leanAngle !== 0) {
			if (this.leanAxis === 'x')
				this.scene.rotate(this.leanAngle, 1, 0, 0);
			else {
				this.scene.rotate(this.leanAngle, 0, 0, 1);
				this.scene.translate(0, -0.1, 0);
			}
		}

		this.scene.pushMatrix();
		this.trunkMaterial.apply();
		this.trunk.display();
		this.scene.popMatrix();

		this.scene.gl.enable(this.scene.gl.BLEND);
		this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
		this.scene.gl.depthMask(false);

		let currentY = this.trunkHeight / 3;
		for (let i = 0; i < this.leaves.length; i++) {
			const leaf = this.leaves[i];
			this.scene.pushMatrix();
			this.scene.translate(0, currentY, 0);
			if (i % 2 === 1) {
				this.scene.rotate(Math.PI / 6, 0, 1, 0);
			}
			this.leafMaterial.apply();
			leaf.display();
			this.scene.popMatrix();
			currentY += leaf.height * 0.8;
		}

		this.scene.gl.depthMask(true);
		this.scene.gl.disable(this.scene.gl.BLEND);	
		this.scene.popMatrix();
	}
}
