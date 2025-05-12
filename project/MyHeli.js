import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyFrustum } from './MyFrustum.js';
import { MyPrism } from './MyPrism.js';
import { MyBlade } from './MyBlade.js';

export class MyHeli extends CGFobject {
  constructor(scene, textures) {
    super(scene);
    this.scene = scene;
    this.textures = textures;

    this.slices = 8;
    this.radius = 5;

    // Prism: (scene, slices, height, radius)
    // Frustum: (scene, slice, height, baseRadius, topRadius, tipOffset)

    this.body = new MyPrism(scene, this.slices, 10, this.radius); 
    this.cockpit = new MyFrustum(scene, this.slices, 5, this.radius, 2.2, [0, -0.6, 0]); 
    this.tail = new MyFrustum(scene, this.slices, 19.5, this.radius, 0.2, [0, 6, 0])
    this.pole = new MyPrism(scene, this.slices, 7, 0.6);
    this.rotor = new MyPrism(scene, this.slices, 1.5, 1);
    this.rotor2 = new MyFrustum(scene, this.slices, 0.3, 1, 0.6);
    this.leg = new MyPrism(scene, this.slices, 6, 0.4);
    this.skid = new MyPrism(scene, this.slices, 15, 0.5);
    this.miniRotor = new MyPrism(scene,this.slices,1,0.5);
    this.miniRotor2 = new MyFrustum(scene, this.slices, 0.3, 1, 0.5);
    this.blade = new MyBlade(this.scene);
    this.miniblade = new MyBlade(this.scene, 1.5, 0.5, 0.05, 3);

  }

  display() {
    this.scene.pushMatrix();
    this.textures.body.apply();
    this.body.display();
    this.scene.popMatrix();
  
    this.scene.pushMatrix();
    this.textures.cockpit.apply();
    this.scene.translate(0, 0, 10); 
    this.cockpit.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.textures.body2.apply();
    this.scene.rotate(Math.PI, 0, 1, 0);                
    this.tail.display();
    this.scene.popMatrix();

    // LADO 1
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 3, 1, 0, 0);
    this.scene.translate(-1,0,4);
    this.textures.black.apply();
    this.leg.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 3, 1, 0, 0);
    this.scene.translate(-9,0,4);
    this.textures.black.apply();
    this.leg.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(5,-9,-2.5);
    this.scene.rotate(Math.PI / 8, 0, 0, 1);
    this.textures.black.apply();
    this.skid.display();
    this.scene.popMatrix();
    // LADO 1

    // LADO 2
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 3, 1, 0, 0);
    this.scene.translate(1,0,4);
    this.textures.black.apply();
    this.leg.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 3, 1, 0, 0);
    this.scene.translate(9,0,4);
    this.textures.black.apply();
    this.leg.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-5,-9,-2.5);
    this.scene.rotate(Math.PI / 8, 0, 0, 1);
    this.textures.black.apply();
    this.skid.display();
    this.scene.popMatrix();
    // LADO 2

    this.scene.pushMatrix();
    this.scene.translate(22.5, 5.95,-20.5);
    this.scene.rotate(Math.PI/2, 0,0,1);

    this.scene.scale(0.4, 2, 0.4);

    this.scene.pushMatrix();
    this.scene.translate(0,12,3);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,12,3);
    this.scene.rotate(3*Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,10.5,3);
    this.scene.rotate(-3*Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor2.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
    
    // HELICES + CAIXA
    this.scene.pushMatrix();
    this.scene.translate(0,-2,0);

    this.scene.pushMatrix();
    this.scene.translate(0,11,3);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.pole.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,12,3);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,12,3);
    this.scene.rotate(3*Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,10.5,3);
    this.scene.rotate(-3*Math.PI / 2, 1, 0, 0);
    this.textures.black.apply();
    this.rotor2.display();
    this.scene.popMatrix();

    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,9,3);

    // HELICES GRANDES
    for (let i = 0; i < 3; i++) {
        this.scene.pushMatrix();
        this.scene.rotate(i * 2 * Math.PI / 3, 0, 1, 0);
        this.textures.blade.apply();
        this.blade.display();
        this.scene.popMatrix();
      }
    this.scene.popMatrix();
    
    // HELICES PEQUENAS
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.translate(-6,1.5,-19.25);
    
    for (let i = 0; i < 3; i++) {
        this.scene.pushMatrix();
        this.scene.rotate((i * 2 * Math.PI / 3) + Math.PI / 2, 0, 1, 0);
        this.textures.blade.apply();
        this.miniblade.display();
        this.scene.popMatrix();
    }
    this.scene.popMatrix();
  }
}
