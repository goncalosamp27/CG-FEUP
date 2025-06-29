	import { CGFobject, CGFappearance } from '../lib/CGF.js';
	import { MyPyramid } from './MyPyramid.js';
	import { MyPlane } from './MyPlane.js';

	export class MyTree extends CGFobject {
	/**
     * 	 @param {CGFscene} scene 
     * 	 @param {Object} options - array de config
     *   @param {number} height - altura
     *   @param {number} trunkRadius - raio do tronco
     *   @param {number} leanAngle - angolo de inclinaçao
     *   @param {string} leanAxis - Eixo de inclinação
     *   @param {Array} leafColor - Cor das folhas 
     *   @param {CGFappearance} trunkMaterial - tronco material
     *   @param {CGFappearance} leafMaterial - leaves material
    */
		constructor(scene, {
			height = 6,
			trunkRadius = 0.7,
			leanAngle = 0,
			leanAxis = 'x',
			leafColor = [0.2, 0.6, 0.2],
			trunkMaterial,
			leafMaterial
		})
		{
			super(scene);

			this.scene = scene;
			this.height = height;
			this.trunkRadius = trunkRadius * 2;
			this.leanAngle = leanAngle * Math.PI / 180;
			this.leanAxis = leanAxis;
			this.leafColor = leafColor;

			this.trunkHeight = height * 0.7;
			this.canopyHeight = height - 0.4*this.trunkHeight;
			this.numLeaves = Math.round(this.canopyHeight);

			this.trunkMaterial = trunkMaterial;
			this.leafMaterial = leafMaterial;
			this.leafMaterial.setAmbient(...leafColor, 1);
			this.leafMaterial.setDiffuse(...leafColor, 1);
					
			this.trunk = new MyPyramid(scene, 7, 10, this.trunkHeight, this.trunkRadius);

			this.leaves = [];
			for (let i = 0; i < this.numLeaves; i++) {
				const leafHeight = this.canopyHeight / this.numLeaves;
				const leafRadius = this.trunkRadius + (this.numLeaves - i) * 0.2;
				this.leaves.push(new MyPyramid(scene, 6, 1, leafHeight, leafRadius));
			}

			this.shadow = new MyPlane(scene, 10, 0, 1, 0, 1);

			this.hasFire = false;
			this.fire = null;
		}
		// desenhar a arvore
		// comecar pelo tronco e depois folhas, aplicar rotaçoes e translações necessarias
		display() {
			this.scene.pushMatrix();

			this.scene.gl.enable(this.scene.gl.BLEND);
			this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
			this.scene.gl.depthMask(false);

			this.scene.pushMatrix();
			this.scene.translate(0, 0.01, 0);
			let shadowScale = this.trunkRadius * 4;
			this.scene.scale(shadowScale, shadowScale, shadowScale);
			this.scene.rotate(-Math.PI / 2, 1, 0, 0); // plano horizontal
			this.scene.shadowMaterial.apply();
			this.shadow.display();
			this.scene.popMatrix();

			this.scene.gl.depthMask(true);
			this.scene.gl.disable(this.scene.gl.BLEND);


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
	
	// Para ativar o incendio
	setOnFire(fireObj) {
		this.hasFire = true;
		this.fire = fireObj;

		const offset = this.trunkRadius + 0.5;
		const signX = Math.random() < 0.5 ? -1 : 1;
		const signZ = Math.random() < 0.5 ? -1 : 1;

		this.fire.scaleFire = 0.8 + Math.random() * 2;

		this.fire.offsetX = offset * signX;
		this.fire.offsetZ = offset * signZ;
	}
}
