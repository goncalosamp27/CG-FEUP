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
		scene.translate(0.5, 0, 0);
		scene.rotate(Math.PI / 2, 0, 1, 0);
		this.quad.display();
		scene.popMatrix();

		scene.pushMatrix();
		scene.translate(-0.5, 0, 0);
		scene.rotate(3*(Math.PI / 2), 0, 1, 0);
		this.quad.display();
		scene.popMatrix();

		this.scene.pushMatrix()
        this.scene.translate(0,0,0.5)
        this.quad.display()
        this.scene.popMatrix()

		this.scene.pushMatrix()
        this.scene.translate(0,0,-0.5)
		scene.rotate(Math.PI, 0, 1, 0);
        this.quad.display()
        this.scene.popMatrix()

		this.scene.pushMatrix()
        this.scene.translate(0,0.5,0)
		scene.rotate(3* Math.PI / 2, 1, 0, 0);
        this.quad.display()
        this.scene.popMatrix()

		this.scene.pushMatrix()
        this.scene.translate(0,-0.5,0)
		scene.rotate(Math.PI / 2, 1, 0, 0);
        this.quad.display()
        this.scene.popMatrix()
	  }
}

