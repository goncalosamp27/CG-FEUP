import { CGFobject } from '../lib/CGF.js';

export class MyPrism extends CGFobject {
	constructor(scene, slices = 8, height = 1, radius = 1) {
		super(scene);
		this.slices = slices;
		this.height = height;
		this.radius = radius;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];
	
		const ang = 2 * Math.PI / this.slices;
	
		// Helper to compute UVs from 4x2 atlas
		const atlasIndexToUV = (index) => {
			const cols = 4;
			const rows = 2;
			const col = index % cols;
			const row = Math.floor(index / cols);
			const u0 = col / cols;
			const u1 = (col + 1) / cols;
			const v0 = row / rows;
			const v1 = (row + 1) / rows;
			return { u0, u1, v0, v1 };
		};
	
		for (let i = 0; i < this.slices; i++) {
			const angle = i * ang;
			const nextAngle = (i + 1) * ang;
	
			const x1 = this.radius * Math.cos(angle);
			const y1 = this.radius * Math.sin(angle);
			const x2 = this.radius * Math.cos(nextAngle);
			const y2 = this.radius * Math.sin(nextAngle);
	
			// Vertices (bottom-left, bottom-right, top-left, top-right)
			this.vertices.push(x1, y1, 0);
			this.vertices.push(x2, y2, 0);
			this.vertices.push(x1, y1, this.height);
			this.vertices.push(x2, y2, this.height);
	
			// Normals (pointing outward, average direction of face)
			const nx = Math.cos(angle + ang / 2);
			const ny = Math.sin(angle + ang / 2);
			for (let j = 0; j < 4; j++) this.normals.push(nx, ny, 0);
	
			// Texture coords from atlas
			const { u0, u1, v0, v1 } = atlasIndexToUV(i);
			// 90° clockwise rotation of cell i
			this.texCoords.push(u1, v1); // bottom-left
			this.texCoords.push(u1, v0); // bottom-right
			this.texCoords.push(u0, v1); // top-left
			this.texCoords.push(u0, v0); // top-right
	
			// Indices (two triangles per quad)
			const baseIndex = i * 4;
			this.indices.push(baseIndex + 3, baseIndex + 2, baseIndex);
			this.indices.push(baseIndex + 1, baseIndex + 3, baseIndex);
		}
		 // ---- Bottom base ----
		 const bottomCenterIndex = this.vertices.length / 3;
		 this.vertices.push(0, 0, 0);
		 this.normals.push(0, 0, -1);
		 this.texCoords.push(0.5, 0.5); // center
	 
		 for (let i = 0; i < this.slices; i++) {
			 const angle = i * ang;
			 const x = this.radius * Math.cos(angle);
			 const y = this.radius * Math.sin(angle);
	 
			 this.vertices.push(x, y, 0);
			 this.normals.push(0, 0, -1);
			 this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
	 
			 const idx1 = bottomCenterIndex + 1 + i;
			 const idx2 = bottomCenterIndex + 1 + ((i + 1) % this.slices);
			 this.indices.push(bottomCenterIndex, idx2, idx1); // CCW (viewed from below)
		 }
	 
		 // ---- Top base ----
		 const topCenterIndex = this.vertices.length / 3;
		 this.vertices.push(0, 0, this.height);
		 this.normals.push(0, 0, 1);
		 this.texCoords.push(0.5, 0.5); // center
	 
		 for (let i = 0; i < this.slices; i++) {
			 const angle = i * ang;
			 const x = this.radius * Math.cos(angle);
			 const y = this.radius * Math.sin(angle);
	 
			 this.vertices.push(x, y, this.height);
			 this.normals.push(0, 0, 1);
			 this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
	 
			 const idx1 = topCenterIndex + 1 + i;
			 const idx2 = topCenterIndex + 1 + ((i + 1) % this.slices);
			 this.indices.push(topCenterIndex, idx1, idx2); // CW (viewed from above)
		 }
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	
}
