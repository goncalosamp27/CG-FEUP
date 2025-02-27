import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
	constructor(scene) {
		super(scene);
		this.quad = new MyQuad(scene);
	}
	
	display() {
		const scene = this.scene;
	
		scene.pushMatrix();
		// scene.translate(2.2, 1, 0);
		// scene.rotate(Math.PI / 4, 0, 0, 1);
		// scene.setDiffuse(0, 1, 0, 1);
		this.quad.display();
		scene.popMatrix();
	  }
}

