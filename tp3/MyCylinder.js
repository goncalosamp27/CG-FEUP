import {CGFobject} from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
	constructor(scene) {
		super(scene);

		this.slices = 8;
		this.stacks = 20;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		const angle = 2 * Math.PI / this.slices;

		for (let i = 0; i <= this.stacks; i++) {
			for (let j = 0; j <= this.slices; j++) {
				this.vertices.push(
					Math.cos(j * angle), 
					Math.sin(j * angle), 
					(1 / this.stacks) * i,
				);
				/*
				this.vertices.push(
					Math.cos((j+1) * angle), 
					Math.sin((j+1) * angle), 
					(1 / this.stacks) * i,
				);
				this.normals.push(
					-(Math.sin(angle * j) - Math.sin(angle * (j + 1))),
					Math.cos(angle * j) - Math.cos(angle * (j + 1)),
					0
				);
				*/
				this.normals.push(
					Math.cos(j * angle),
					Math.sin(j * angle),
					0
				);
			}
		}

		/*
		for (let k = 0; k < this.stacks; k++) {
			for (let l = 0; l < this.slices; l++) {
				let current1 = (l * 2) + (k * (this.slices + 1) * 2);
				let current2 = current1 + 1;
				let above1 = current1 + (this.slices + 1) * 2;
				let above2 = current2 + (this.slices + 1) * 2;
		
				this.indices.push(current1, current2, above1);
				this.indices.push(current2, above2, above1);
			}
		}
		*/
		for (let i = 0; i < this.stacks; i++) {
			for (let j = 0; j < this.slices; j++) {
				let current = i * (this.slices + 1) + j;
				let next = current + 1;
				let above = current + (this.slices + 1);
				let aboveNext = above + 1;
		
				this.indices.push(next, above, current);
				this.indices.push(aboveNext, above, next);
			}
		}
		

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateBuffers(complexity){
	}
}