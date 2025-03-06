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
			0.5, 0.5, 0.5, // 0 superior direito frente
			-0.5, 0.5, 0.5, // 1 superior esquerdo frente
			-0.5, -0.5, 0.5, // 2 inferior esquerdo frente
			0.5, -0.5, 0.5, // 3 inferior direita frente

			0.5, 0.5, -0.5, // 4 superior direito trás
			-0.5, 0.5, -0.5, // 5 superior esquerdo trás
			-0.5, -0.5, -0.5, // 6 inferior esquerdo trás
			0.5, -0.5, -0.5, // 7 inferior direita trás
		];

		//Counter-clockwise reference of vertices
		this.indices = [ 
			         // assumindo que estámos a ver o cubo de frente: 
			0, 1, 2, // face de frente
			3, 0, 2, 
			
			6, 5, 4, // face de trás
			6, 4, 7,

			0, 4, 5, // face de cima
			0, 5, 1,

			6, 7, 3, // face de baixo
			3, 2, 6,

			7, 4, 0, // face lateral y positivo
			7, 0, 3,

			2, 1, 5, // face lateral y negativo
			2, 5, 6,
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

