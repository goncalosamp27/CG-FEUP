import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
	constructor(scene, textop, texbot, texside1, texside2, texside3, texside4) {
		super(scene);
		this.quad = new MyQuad(scene);
		this.textop = textop;
		this.texbot = texbot;
		this.texside1 = texside1;
		this.texside2 = texside2;		
		this.texside3 = texside3;
		this.texside4 = texside4;
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
	}
	
	display() {
		const scene = this.scene;
		const gl = this.scene.gl;
	
		const applyTexture = (texture) => {
			texture.bind();
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // comenta para interpolação
		};
	
		scene.pushMatrix();
		scene.translate(0.5, 0, 0);
		scene.rotate(Math.PI / 2, 0, 1, 0);
		applyTexture(this.texside1);
		this.quad.display();
		scene.popMatrix();
	
		scene.pushMatrix();
		scene.translate(-0.5, 0, 0);
		scene.rotate(3 * (Math.PI / 2), 0, 1, 0);
		applyTexture(this.texside2);
		this.quad.display();
		scene.popMatrix();
	
		scene.pushMatrix();
		scene.translate(0, 0, 0.5);
		applyTexture(this.texside3);
		this.quad.display();
		scene.popMatrix();
	
		scene.pushMatrix();
		scene.translate(0, 0, -0.5);
		scene.rotate(Math.PI, 0, 1, 0);
		applyTexture(this.texside4);
		this.quad.display();
		scene.popMatrix();
	
		scene.pushMatrix();
		scene.translate(0, 0.5, 0);
		scene.rotate(3 * Math.PI / 2, 1, 0, 0);
		applyTexture(this.textop);
		this.quad.display();
		scene.popMatrix();
	
		scene.pushMatrix();
		scene.translate(0, -0.5, 0);
		scene.rotate(Math.PI / 2, 1, 0, 0);
		applyTexture(this.texbot);
		this.quad.display();
		scene.popMatrix();
	}	
}

