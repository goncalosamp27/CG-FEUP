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

    this.position = { x: 0, y: 0, z: 0 };
    this.state = "landed"; // "landed", "taking_off", "flying", "landing"
    this.cruiseAltitude = 20;
    this.velocity = 0;
    this.orientation = 0; 

    this.bladeRotation = 0;
    this.bladeRotationSpeed = 0;
    this.maxBladeSpeed = 10; // podes ajustar este valor

    this.roll = 0; // Inclinação atual
    this.targetRoll = 0; // Inclinação desejada
    this.maxRoll = 0.2; // Máxima inclinação (ajustável)
    this.rollSpeed = 2; 
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.scene.rotate(this.roll, 0, 0, 1); 
    this.scene.rotate(this.orientation, 0, 1, 0);

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

    // HELICES Grandes
    this.scene.pushMatrix();
    this.scene.translate(0, 9, 3);
    this.scene.rotate(this.bladeRotation, 0, 1, 0); // aplica a rotação animada

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

    this.scene.popMatrix();
  }

  turn(v) {
    this.orientation += v;
  
    this.direction = {
      x: Math.sin(this.orientation),
      z: Math.cos(this.orientation),
    };
  
    this.targetRoll = v > 0 ? this.maxRoll : -this.maxRoll;
  }

  update(t) {
    if (this.lastUpdateTime === undefined) {
      this.lastUpdateTime = t;
      return;
    }
  
    const delta = (t - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = t;
  
    if (this.state === "taking_off") {
      if (this.bladeRotationSpeed < this.maxBladeSpeed) {
        this.bladeRotationSpeed += 2 * delta; 
      }
  
      this.position.y += 2 * delta;
  
      if (this.position.y >= this.cruiseAltitude) {
        this.position.y = this.cruiseAltitude;
        this.state = "flying";
        this.bladeRotationSpeed = this.maxBladeSpeed;
      }
    }

    if (this.state === "flying") {
      if (this.turningLeft) {

        this.scene.rotate(0.15, 0, 0, 1); // inclina para a esquerda
      } 
      else if (this.turningRight) {
        this.scene.rotate(-0.15, 0, 0, 1); // inclina para a direita
      }
    }    

    this.roll += (this.targetRoll - this.roll) * this.rollSpeed * delta;
    this.bladeRotation += this.bladeRotationSpeed * delta;
  }
}
