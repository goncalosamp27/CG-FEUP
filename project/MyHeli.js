import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyFrustum } from './MyFrustum.js';
import { MyPrism } from './MyPrism.js';
import { MyBlade } from './MyBlade.js';

export class MyHeli extends CGFobject {
  constructor(scene, textures, cruiseAltitude) {
    super(scene);
    this.scene = scene;
    this.textures = textures;
    this.cruiseAltitude = cruiseAltitude;

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
    this.velocity = 0;
    this.orientation = 0; 
    this.direction = { x: 0, z: 1 };

    this.bladeRotation = 0;
    this.bladeRotationSpeed = 0;
    this.maxBladeSpeed = 10; // podes ajustar este valor

    this.roll = 0; // Inclinação atual
    this.targetRoll = 0; // Inclinação desejada
    this.maxRoll = 0.075; 
    this.rollSpeed = 2; 

    this.pitch = 0; // inclinação frontal atual
    this.targetPitch = 0; // inclinação desejada com W/S
    this.maxPitch = 0.1;

    this.tailBladeRotation = 0;
    this.tailBladeSpeed = 0;
    this.tailBladeMaxSpeed = 10; // ajustável
    this.tailBladeAcceleration = 10;

    this.hoverActive = false; // se a oscilação está ativa
    this.hoverAmplitude = 1;     // altura máxima da oscilação
    this.hoverSpeed = 2.0;         // frequência da oscilação
    this.hoverTime = 0;            // acumulador de tempo para a animação

    this.initialPosition = { x: 0, y: 0, z: 0 };
    this.position = { ...this.initialPosition };
  }

  initiateLandingSequence() {
    this.isReturningToBase = true;
    this.landingTarget = { x: 0, z: -12 };
    this.targetOrientation = 0; 
  }
  

  display() {
    this.scene.pushMatrix();
    this.scene.translate(
      this.position.x + this.hoverOffsetX,
      this.position.y + this.hoverOffsetY,
      this.position.z + this.hoverOffsetZ
    );
        this.scene.rotate(this.orientation, 0, 1, 0);  
    this.scene.rotate(this.roll, 0, 0, 1);        
    this.scene.rotate(this.pitch, 1, 0, 0);       

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
    this.scene.rotate(this.tailBladeRotation, 0, 1, 0); // rotação animada

    for (let i = 0; i < 3; i++) {
        this.scene.pushMatrix();
        this.scene.rotate(i * 2 * Math.PI / 3, 0, 1, 0);
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
    this.hoverTime += delta;

    const pitchDiff = this.targetPitch - this.pitch;
    this.pitch += pitchDiff * 5 * delta;

    if (this.hoverActive) {
      const hoverOffset = Math.sin(this.hoverTime * this.hoverSpeed) * this.hoverAmplitude;
      this.hoverOffsetY = hoverOffset;
      this.hoverOffsetX = Math.sin(this.hoverTime * 1.7) * 0.2;
      this.hoverOffsetZ = Math.cos(this.hoverTime * 1.3) * 0.2;

    } else {
      this.hoverOffsetZ = 0;
      this.hoverOffsetY = 0;
      this.hoverOffsetX = 0;
    }
    
  
    if (this.state === "taking_off") {
      if (this.bladeRotationSpeed < this.maxBladeSpeed) {
        this.bladeRotationSpeed += 2 * delta; 
      }

      if (this.position.y >= 2) {
        this.hoverActive = true;
        this.hoverTime = 0; 
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

      this.position.x += this.velocity * this.direction.x * delta;
      this.position.z += this.velocity * this.direction.z * delta;

      const rollDiff = this.targetRoll - this.roll;
      this.roll += rollDiff * 5 * delta;

      const pitchDiff = this.targetPitch - this.pitch;
      this.pitch += pitchDiff * 5 * delta;
    }    

    // ATERRAR
    if (this.isReturningToBase) {
      const deltaY = this.position.y - this.initialPosition.y;

      if(deltaY <= 2) {
        if (this.hoverActive) {
          this.hoverActive = false;
          this.hoverOffsetX = 0;
          this.hoverOffsetY = 0;
          this.hoverOffsetZ = 0;
        }
      }
    
      const angleDiff = this.targetOrientation - this.orientation;
      if (Math.abs(angleDiff) > 0.01) {
        this.orientation += angleDiff * 0.1; 
      }
    
      const dx = this.initialPosition.x - this.position.x;
      const dz = this.initialPosition.z - this.position.z;
      const distanceXZ = Math.sqrt(dx * dx + dz * dz);
    
      const moveSpeed = 5; 
      const descendSpeed = 2; 
    
      if (distanceXZ > 0.1) {
        const dirX = dx / distanceXZ;
        const dirZ = dz / distanceXZ;
        this.position.x += dirX * moveSpeed * delta;
        this.position.z += dirZ * moveSpeed * delta;
      } else {
        this.position.x = this.initialPosition.x;
        this.position.z = this.initialPosition.z;
    
        if (deltaY > 0.01) {
          this.position.y -= descendSpeed * delta;
        } else {
          // fm aterragem
          this.position.y = this.initialPosition.y;
          this.state = "landed";
          this.tailBladeTargetSpeed = 0;
          this.velocity = 0;
          this.hoverActive = false;
          this.isReturningToBase = false;
          console.log("Helicopter landed smoothly on helipad.");
        }
      }
    }
    // ATERRAR    
    
    this.roll += (this.targetRoll - this.roll) * this.rollSpeed * delta;
    this.bladeRotation += this.bladeRotationSpeed * delta;

    if (this.tailBladeSpeed < this.tailBladeTargetSpeed) {
      this.tailBladeSpeed = Math.min(this.tailBladeSpeed + this.tailBladeAcceleration * delta, this.tailBladeTargetSpeed);
    } 
    else if (this.tailBladeSpeed > this.tailBladeTargetSpeed) {
      this.tailBladeSpeed = Math.max(this.tailBladeSpeed - this.tailBladeAcceleration * delta, this.tailBladeTargetSpeed);
    }

    if (this.state === "landed" && (this.bladeRotationSpeed > 0 || this.tailBladeSpeed > 0)) {
      const deceleration = 4 * delta;
      this.bladeRotationSpeed = Math.max(0, this.bladeRotationSpeed - deceleration);
      this.tailBladeSpeed = Math.max(0, this.tailBladeSpeed - deceleration);
    }

    this.tailBladeRotation += this.tailBladeSpeed * delta;
  }

  accelerate(v) {
    this.velocity += v;
    this.velocity = Math.max(0, Math.min(20, this.velocity)); // limita a velocidade
  }  

  setCruiseAltitude(value) {
    this.cruiseAltitude = Math.max(10, Math.min(50, value));
  }  
}
