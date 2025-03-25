import {CGFobject} from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-1, 1, 0,  // 0
			-1, -1, 0, // 1
			1, -1, 0,  // 2
		];

		// Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];

		this.normals = [
			0, 0, 1, 
			0, 0, 1,
			0, 0, 1,
		];

		this.texCoordsSet1 = [
			0, 0.5,   
			0, 1,     
			0.5, 1    
		];

		this.texCoordsSet2 = [
			0, 0,     
			0.5, 0.5, 
			1, 0      
		];

		this.texCoordsSet3 = [
			0.75,0.75,
			0.5,0.5,
			0.25,0.75
		];

		// this.texCoords = [...this.texCoordsSet1];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(mappingIndex) {
		if (mappingIndex === 0) {
			this.texCoords = [...this.texCoordsSet1];
		} 
		else if (mappingIndex === 1) {
			this.texCoords = [...this.texCoordsSet2];
		}
		else {
			this.texCoords = [...this.texCoordsSet3];
		}
		this.updateTexCoordsGLBuffers();
	}
}
