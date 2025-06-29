import { CGFobject } from '../lib/CGF.js';
import { MyFrustum } from './MyFrustum.js';
import { MyPrism } from './MyPrism.js';
import { MyBlade } from './MyBlade.js';
import { MyLake } from './MyLake.js';
import { MyRope } from './MyRope.js';

export class MyHeli extends CGFobject {

  /**
   * @param {CGFscene} scene        
   * @param {Object} textures       - texturas usadas no modelo
   * @param {number} cruiseAltitude - Altitude de cruzeiro
  */
  constructor(scene, textures, cruiseAltitude) {
    super(scene);
    this.scene = scene;
    this.textures = textures;
    this.cruiseAltitude = cruiseAltitude;

    this.slices = 8;
    this.radius = 5;  

    // Componentes do helicoptero
    // Prism: (scene, slices, height, radius)
    // Frustum: (scene, slice, height, baseRadius, topRadius, tipOffset)
    this.body = new MyPrism(scene, this.slices, 10, this.radius); // corpo (central)
    this.cockpit = new MyFrustum(scene, this.slices, 5, this.radius, 2.2, [0, -0.6, 0]); // parte de frente / cabeça
    this.tail = new MyFrustum(scene, this.slices, 19.5, this.radius, 0.2, [0, 6, 0]); // cauda
    this.pole = new MyPrism(scene, this.slices, 7, 0.6); // pole das helices
    this.rotor = new MyPrism(scene, this.slices, 1.5, 1); // componente do pole 1
    this.rotor2 = new MyFrustum(scene, this.slices, 0.3, 1, 0.6); // componente do pole 2
    this.leg = new MyPrism(scene, this.slices, 6, 0.4); // perna do helicoptero 1
    this.skid = new MyPrism(scene, this.slices, 15, 0.5); // barra de pouso
    this.miniRotor = new MyPrism(scene,this.slices,1,0.5); // mini rotor das helices de tras
    this.miniRotor2 = new MyFrustum(scene, this.slices, 0.3, 1, 0.5); // mini rotor das helices de tras2
    this.blade = new MyBlade(this.scene); // laminas de cima
    this.miniblade = new MyBlade(this.scene, 1.5, 0.5, 0.05, 3); // laminas de tras (pequenas)

    this.position = { x: 0, y: 0, z: 0 };
    this.state = "landed"; // "landed",  // "taking_off", // "flying"
    this.velocity = 0;
    this.orientation = 0; 
    this.direction = { x: 0, z: 1 };

    this.isCollectingWater = false;
    this.waterCollectionTime = 0;
    this.isBucketFull = false;
    this.isBucketOut = false;
    this.returningToCruise = false;
    this.isDroppingWater = false;
    this.bucketRotation      = 0;       
    this.bucketRotationSpeed = Math.PI;
    this.bucketReturnSpeed   = Math.PI / 2;
    this.bucketHoldTime      = 4; 
    this.bucketHoldTimer     = 0;

    this.bladeRotation = 0;
    this.bladeRotationSpeed = 0;
    this.maxBladeSpeed = 10;

    this.roll = 0;        // Inclinação atual
    this.targetRoll = 0; // Inclinação desejada
    this.maxRoll = 0.075; 
    this.rollSpeed = 2; 

    this.pitch = 0;        // inclinação frontal atual
    this.targetPitch = 0; // inclinação desejada com W/S
    this.maxPitch = 0.1;

    this.tailBladeRotation = 0;
    this.tailBladeSpeed = 0;
    this.tailBladeMaxSpeed = 10; 
    this.tailBladeAcceleration = 10;

    this.hoverActive = false; // se a oscilação está ativa
    this.hoverAmplitude = 1; // altura máxima da oscilação
    this.hoverSpeed = 2.0;  // frequência da oscilação
    this.hoverTime = 0;    // acumulador de tempo para a animação

    this.initialPosition = { x: 0, y: 0, z: 0 };
    this.position = { ...this.initialPosition };

    // Frustum: (scene, slice, height, baseRadius, topRadius, tipOffset)
    // this.bucket = new MyFrustum(scene, 20, 4, 3, 2, [0,0,0], false);
    this.bucket = new MyFrustum(scene, 20, 4, 3.5, 3, [0,0,0], false);
    this.bucketOffset = [0, 5, -1];

    this.bucketDropOffsetY = 0;      
    this.bucketDropTargetY = -15;     
    this.bucketDropSpeed = 3;        

    // para o balde com água
    this.water = new MyLake(scene, 3.3, 0.1, 128);

    // cordas que seguram o balde
    this.cable1 = new MyRope(scene);
    this.cable2 = new MyRope(scene);
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.position.x + this.hoverOffsetX, this.position.y + this.hoverOffsetY, this.position.z + this.hoverOffsetZ);
    this.scene.rotate(this.orientation, 0, 1, 0);  
    this.scene.rotate(this.roll, 0, 0, 1);        
    this.scene.rotate(this.pitch, 1, 0, 0); 

    const start = { x: 0, y: -1, z:  5 };  
    const bx = this.bucketOffset[0];
    const by = this.bucketOffset[1];
    const bz = this.bucketOffset[2] - this.bucketDropOffsetY;

    const bucketTopLocal = {
      x: bx,
      y: -bz - 0.8,
      z: by
    };

    const end1 = { x: bucketTopLocal.x + 3.3, y: bucketTopLocal.y, z: bucketTopLocal.z };
    const end2 = { x: bucketTopLocal.x - 3.3, y: bucketTopLocal.y, z: bucketTopLocal.z };

    this.cable1.setEndpoints(
      start.x, start.y, start.z,
      end1.x,   end1.y,   end1.z
    );
    this.cable2.setEndpoints(
      start.x, start.y, start.z,
      end2.x,   end2.y,   end2.z
    );
    this.textures.rope.apply();
    this.cable1.display();
    this.cable2.display();

    // para animaçao de coletar agua
    if (this.isCollectingWater || this.isBucketFull || this.isBucketOut) {
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(
          this.bucketOffset[0],
          this.bucketOffset[1],
          this.bucketOffset[2] - this.bucketDropOffsetY
        );
        this.scene.rotate(this.bucketRotation, 1, 0, 0);
        this.textures.blade.apply();
        this.bucket.display();
      this.scene.popMatrix();
    }

    // dislay do balde com agua
    if (this.isBucketFull && this.bucketRotation === 0) {
      this.scene.pushMatrix();
        this.scene.setActiveShader(this.scene.waterShader);
        this.scene.waterMaterial.apply();
        this.scene.waterMapTexture.bind(2);
        this.scene.translate(0,-14.5,4.9);
        this.scene.rotate(this.bucketRotation, 1, 0, 0);
        this.water.display();
      this.scene.popMatrix();
      this.scene.setActiveShader(this.scene.defaultShader);
    }

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
    // FIM LADO 1

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
    // FIM LADO 2

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
  // FUNÇAO DE ROTAÇAO SEGUNDO Y DO HELICOPTERO
  turn(v) {
    if (this.isReturningToBase) return;
    
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
    
    // levantar voo
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

    // em voo
    if (this.state === "flying") {
      if (this.turningLeft) {
        this.scene.rotate(0.15, 0, 0, 1); 
      } 
      else if (this.turningRight) {
        this.scene.rotate(-0.15, 0, 0, 1); 
      }

      this.position.x += this.velocity * this.direction.x * delta;
      this.position.z += this.velocity * this.direction.z * delta;

      const rollDiff = this.targetRoll - this.roll;
      this.roll += rollDiff * 5 * delta;

      const pitchDiff = this.targetPitch - this.pitch;
      this.pitch += pitchDiff * 5 * delta;
    }    

    // em retorno
    if (this.isReturningToBase) {
      const deltaY = this.position.y - this.initialPosition.y;

      if (deltaY <= 2 && this.hoverActive) {
        this.hoverActive = false;
        this.hoverOffsetX = 0;
        this.hoverOffsetY = 0;
        this.hoverOffsetZ = 0;
      }

      let angleDiff = this.targetOrientation - this.orientation;
      angleDiff = this.normalizeAngle(angleDiff);

      const maxAngularSpeed = 1.5;
      const angleStep = Math.sign(angleDiff) *
        Math.min(Math.abs(angleDiff), maxAngularSpeed * delta);

      this.orientation += angleStep;

      const dx = this.initialPosition.x - this.position.x;
      const dz = this.initialPosition.z - this.position.z;
      const distanceXZ = Math.sqrt(dx * dx + dz * dz);

      const moveSpeed = 7;
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
      const deceleration = 3 * delta;
      this.bladeRotationSpeed = Math.max(0, this.bladeRotationSpeed - deceleration);
      this.tailBladeSpeed = Math.max(0, this.tailBladeSpeed - deceleration);
    }

    this.tailBladeRotation += this.tailBladeSpeed * delta;

    // para coletar a agua
    if (this.isCollectingWater) {
      const descendSpeed = 5;
      const holdTime = 2; 
      const deltaY = this.position.y - this.targetAltitude;
    
      if (!this.isBucketFull) {
        if (deltaY > 0.1) {
          this.position.y -= descendSpeed * delta;
          if (this.position.y < this.targetAltitude) this.position.y = this.targetAltitude;
        } 
        else 
        {
          this.waterCollectionTime += delta;
          if (this.waterCollectionTime >= holdTime) {
            this.isBucketFull = true;
            console.log("Bucket full");
          }
        }
      } 
    }

    // voltar a altitude de cruseiro
    if (this.returningToCruise) { 
      const localCruiseY = this.cruiseAltitude / this.scene.heliscale; 
      const deltaY = localCruiseY - this.position.y;
      const ascendSpeed = 4;
    
      if (Math.abs(deltaY) > 0.1) {
        const direction = Math.sign(deltaY);
        this.position.y += direction * ascendSpeed * delta;
    
        // Corrigir overshoot
        if ((direction > 0 && this.position.y > localCruiseY) ||
            (direction < 0 && this.position.y < localCruiseY)) {
          this.position.y = localCruiseY;
        }
      } else {
        this.position.y = localCruiseY;
        this.returningToCruise = false;
        this.targetPitch = 0;
        console.log("Returned to cruise altitude");
      }
    }    

    // balde e agua
    if (this.isCollectingWater || this.isBucketFull) {
      if (this.bucketDropOffsetY > this.bucketDropTargetY) {
        this.bucketDropOffsetY -= this.bucketDropSpeed * delta;
        if (this.bucketDropOffsetY < this.bucketDropTargetY) {
          this.bucketDropOffsetY = this.bucketDropTargetY;
        }
      }
    } else {
      if (this.bucketDropOffsetY < 0) {
        this.bucketDropOffsetY += this.bucketDropSpeed * delta;
        if (this.bucketDropOffsetY > 0) {
          this.bucketDropOffsetY = 0;
        }
      }
    }
    
    // rotaçao para despejar agua
    if (this.isDroppingWater) {
      this.bucketRotation += this.bucketRotationSpeed * delta;
      if (this.bucketRotation >= Math.PI) {
        this.bucketRotation = Math.PI;
        this.isReturningBucket = true;
        this.isDroppingWater = false;
        this.bucketHoldTimer = 0; 
      }
    } 
    else if (this.isReturningBucket && this.bucketHoldTimer < this.bucketHoldTime) {
  this.bucketHoldTimer += delta;
    }
    else if (this.isReturningBucket) {
      this.bucketRotation -= this.bucketReturnSpeed * delta;
      if (this.bucketRotation <= 0) {
        this.bucketRotation = 0;
        this.isReturningBucket = false;
        this.isBucketFull = false;
      }
    }
  }

  // funçao de aceleraçao 
  accelerate(v) {
    if (this.isReturningToBase) return;
    this.velocity += v;
    this.velocity = Math.max(0, Math.min(30, this.velocity)); // limita a velocidade
  }
  // state -> aterrar
  initiateLandingSequence() {
    this.state = "landing";
    this.isReturningToBase = true;
    this.landingTarget = { x: 0, z: -12 };
    this.targetOrientation = 0; 
  }
  // trocar altitude de cruzeiro
  setCruiseAltitude(value) {
    this.cruiseAltitude = value;
  }  
  // verifica se está em cima do lago (circulo, checkar a soma dos quadrados)
  isOverLake(lakeCenterX, lakeCenterZ, lakeRadius, worldX = this.position.x, worldZ = this.position.z) {
    const dx = worldX - lakeCenterX;
    const dz = worldZ - lakeCenterZ;
    const distanceSquared = dx * dx + dz * dz;
    return distanceSquared <= lakeRadius * lakeRadius;
  }

  // checkar se esta em cima da floresta
  isOverForest(forestBeginX, forestBeginZ, forestEndX, forestEndZ, worldX, worldZ) {
    const minX = Math.min(forestBeginX, forestEndX);
    const maxX = Math.max(forestBeginX, forestEndX);
    const minZ = Math.min(forestBeginZ, forestEndZ);
    const maxZ = Math.max(forestBeginZ, forestEndZ);
  
    return worldX >= minX && worldX <= maxX && worldZ >= minZ && worldZ <= maxZ;
  }

  // iniciar a coleta de agua
  collectWater(currentWorldY) {
    if (this.isCollectingWater || this.isBucketFull) return;
  
    this.isCollectingWater = true;
    this.waterCollectionTime = 0;
    this.isBucketOut = true;
  
    const desiredWorldY = 7;
  
    const deltaYScene = currentWorldY - desiredWorldY;
    const localTargetY = this.position.y - deltaYScene / this.scene.heliscale;
  
    this.targetAltitude = localTargetY;
    console.log("descer até:", localTargetY);
  }

  // voltar a altitude de cruzeiro
  backToCruiseAltitude(currentWorldY) {
    this.isCollectingWater = false;
    const desiredWorldY = this.cruiseAltitude; 
    const scale = this.scene.heliscale;

    const deltaYScene = desiredWorldY - currentWorldY;
    const localTargetY = this.position.y + deltaYScene / scale;

    this.targetAltitude = localTargetY;
    this.returningToCruise = true;
  }

  // despejar a agua
  dropWater() {
    this.isDroppingWater = true;
    this.isReturningBucket = false;
    this.bucketHoldTimer = 0;

    const localX = 0;
    const localY = -13;
    const localZ = 4;

    const cosO = Math.cos(this.orientation);
    const sinO = Math.sin(this.orientation);

    const rotatedX = localX * cosO + localZ * sinO;
    const rotatedZ = localX * sinO + localZ * cosO;
    const rotatedY = localY;

    const scale = this.scene.heliscale;
    const heliWorldPos = this.scene.getHeliWorldPosition();

    const dropX = heliWorldPos.x + rotatedX * scale;
    const dropY = heliWorldPos.y + rotatedY * scale - 2;
    const dropZ = heliWorldPos.z + rotatedZ * scale;

    console.log("Drop pos (final):", dropX, dropY, dropZ);
    this.scene.startWaterDrop(dropX, dropY, dropZ);
  }

  mod(x,m) {
    return ((x % m) + m) % m;
  }

  normalizeAngle(a) {
    return this.mod(a + Math.PI, 2 * Math.PI) - Math.PI;
  }
}

