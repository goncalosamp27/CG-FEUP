import { CGFobject } from '../lib/CGF.js';

export class MySphere extends CGFobject {
	constructor(scene, radius, slices, stacks) {
		super(scene);
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		const dPhi = 2 * Math.PI / this.slices;
		const dTheta = Math.PI / (2 * this.stacks); // stacks só num hemisfério

		for (let stack = 0; stack <= 2 * this.stacks; stack++) {
			let theta = -Math.PI / 2 + stack * dTheta;
			let y = Math.sin(theta);
			let r = Math.cos(theta);

			for (let slice = 0; slice <= this.slices; slice++) {
				let phi = slice * dPhi;
				let x = r * Math.cos(phi);
				let z = r * Math.sin(phi);

				this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

				const len = Math.sqrt(x * x + y * y + z * z);
				this.normals.push(x / len, y / len, z / len);

				let s = 1 - slice / this.slices;
				let t = 1 - stack / (2 * this.stacks);
				this.texCoords.push(s, t);
			}
		}

		// Índices
		for (let stack = 0; stack < 2 * this.stacks; stack++) {
			for (let slice = 0; slice < this.slices; slice++) {
				let current = stack * (this.slices + 1) + slice;
				let next = current + this.slices + 1;

				this.indices.push(current, next, current + 1);
				this.indices.push(current + 1, next, next + 1);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
