import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			// face frente
			0.5, 0.5, 0.5,  // 0
			-0.5, 0.5, 0.5, // 1
			-0.5, -0.5, 0.5, // 2
			0.5, -0.5, 0.5, // 3
	
			// face trás
			0.5, 0.5, -0.5, // 4
			-0.5, 0.5, -0.5, // 5
			-0.5, -0.5, -0.5, // 6
			0.5, -0.5, -0.5, // 7
	
			// face cima
			0.5, 0.5, 0.5, // 8
			-0.5, 0.5, 0.5, // 9
			-0.5, 0.5, -0.5, // 10
			0.5, 0.5, -0.5, // 11
	
			// face baixo
			0.5, -0.5, 0.5, // 12
			-0.5, -0.5, 0.5, // 13
			-0.5, -0.5, -0.5, // 14
			0.5, -0.5, -0.5, // 15
	
			// face direita
			0.5, 0.5, 0.5, // 16
			0.5, -0.5, 0.5, // 17
			0.5, -0.5, -0.5, // 18
			0.5, 0.5, -0.5, // 19
	
			// face esquerda
			-0.5, 0.5, 0.5, // 20
			-0.5, -0.5, 0.5, // 21
			-0.5, -0.5, -0.5, // 22
			-0.5, 0.5, -0.5, // 23
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			// Front face
			0, 1, 2,
			2, 3, 0,
	
			// Back face
			6, 5, 4,
			4, 7, 6,
	
			// Top face
			10, 9, 8,
			8, 11, 10,
	
			// Bottom face
			12, 13, 14,
			14, 15, 12,
	
			// Right face
			16, 17, 18,
			18, 19, 16,
	
			// Left face
			22, 21, 20,
			20, 23, 22
		];
	
		this.normals = [
			// Face frente (0, 0, 1)
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
	
			// Face trás (0, 0, -1)
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
	
			// Face cima (0, 1, 0)
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
	
			// Face baixo (0, -1, 0)
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
	
			// Face direita (1, 0, 0)
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
	
			// Face esquerda (-1, 0, 0)
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

