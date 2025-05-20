
import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js"
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";
import { MyFire } from "./MyFire.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    this.displayAxis = false;
    this.displayPlane = true;
    this.displayGlobe = false;
    this.displayPanorama = true;
    this.displayBuilding = true;
    this.displayForest = true;
    this.displayHeli = true;
    this.displayLake = true;
    this.displayFire = false;
    this.speedFactor = 1;
    this.cruiseAltitude = 15;
    this.fireAlreadyStarted = false;

    super.init(application);
    this.initTextures();
    this.initHeliTextures();
    
    super.init(application);
    this.initCameras();
    this.initLights();

    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);
    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 1, 0, 10, 0, 10);
    this.sphere = new MySphere(this, 10, 50, 50);

    const panoramaTexture = new CGFappearance(this);
    panoramaTexture.setEmission(1.0, 1.0, 1.0, 1.0);
    panoramaTexture.setAmbient(0.0, 0.0, 0.0, 1.0);
    panoramaTexture.setDiffuse(0.0, 0.0, 0.0, 1.0);
    panoramaTexture.setSpecular(0.0, 0.0, 0.0, 1.0);
    panoramaTexture.setShininess(0.0);
    panoramaTexture.loadTexture("textures/background.jpg");
    panoramaTexture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

    this.panorama = new MyPanorama(this, panoramaTexture);

    this.grassMaterial = new CGFappearance(this);
    this.grassMaterial.setAmbient(1, 1, 1, 1);
    this.grassMaterial.setDiffuse(1, 1, 1, 1);
    this.grassMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.grassMaterial.setShininess(10.0);
    this.grassMaterial.loadTexture("textures/grass.jpg");
    this.grassMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.earthMaterial = new CGFappearance(this);
    this.earthMaterial.setAmbient(2.5, 2.5, 2.5, 1);
    this.earthMaterial.setShininess(10.0);
    this.earthMaterial.loadTexture("textures/earth.jpg");
    this.earthMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.windowTexture = "textures/window.png";

    this.numFloorsSide   = 3;
    this.windowsPerFloor = 3;

    this.buildBuilding();
    this.forest = new MyForest(this);

    this.heli = new MyHeli(this, this.heliTextures, this.cruiseAltitude);

    this.waterMaterial = new CGFappearance(this);
    this.waterMaterial.setAmbient(0.4, 0.6, 1.0, 0.8);  
    this.waterMaterial.setDiffuse(0.4, 0.6, 1.0, 0.8);
    this.waterMaterial.setSpecular(0.5, 0.5, 0.5, 0.8); 
    this.waterMaterial.loadTexture("textures/waterTex.jpg");
    this.waterMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({ uSampler2: 2, timeFactor: 0 });

    this.waterMapTexture = new CGFtexture(this, "textures/waterMap.jpg");

    this.lakeRadius = 10;
    this.lakeTX = -30;
    this.lakeTZ = 15;
    this.lake = new MyLake(this, this.lakeRadius, 0.1);

    this.forestTX = 26;
    this.forestTZ = 7;
    this.forestScale = 2.5;
  }
  
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setAmbient(0.2, 0.2, 0.2, 1.0);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      Math.PI / 2, 
      0.1,
      1000,
      vec3.fromValues(-25, 10, 40),
      vec3.fromValues(0, 0, 0)
    );
  }
  
  
  update(t) {
    this.checkKeys();
    this.heli.update(t);
    this.waterShader.setUniformsValues({ timeFactor: t / 100.0 % 1000});

    if (this.displayFire && !this.fireAlreadyStarted) {
      this.fireAlreadyStarted = true; // evita repetir
    
      this.forest.trees.forEach(({ tree }) => {
        if (!tree.hasFire && Math.random() < 0.7) {
          const numFlames = 4 + Math.floor(Math.random() * 6);
          const fire = new MyFire(this, numFlames, 2, this.textures.fire, tree.height);
          tree.setOnFire(fire);
        }
      });
    }
    
    if (!this.displayFire && this.fireAlreadyStarted) {
      this.fireAlreadyStarted = false;
    
      this.forest.trees.forEach(({ tree }) => {
        if (tree.hasFire) {
          tree.hasFire = false;
          tree.fire = null;
        }
      });
    }
    
  }

  updateBuilding() {
    this.buildBuilding();
    this.resetHeli();
  }

  buildBuilding() {
    this.building = new MyBuilding(
      this,
      this.numFloorsSide,
      this.windowsPerFloor,
      this.textures.window,
      [0.82, 0.82, 0.82],
      this.textures.wall,
      this.textures.door,
      this.textures.sign,
      this.textures.helipad
    );    
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    
    if (this.displayAxis) {
      this.setDefaultAppearance();
      this.axis.display();
    }

    if(this.displayPanorama) {
      this.pushMatrix();
      this.translate(0,-80,0)
      this.panorama.display();
      this.setDefaultAppearance();
      this.popMatrix();
    }

    if (this.displayPlane) {
      this.pushMatrix();
      this.scale(400, 1, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.grassMaterial.apply();
      this.plane.display();
      this.popMatrix();
    }
  
    if (this.displayGlobe) {
      this.pushMatrix();
      this.rotate(3 * Math.PI / 4, 0, 1, 0);
      this.earthMaterial.apply();
      this.sphere.display();
      this.popMatrix();
    }
    if (this.displayBuilding) {
      this.pushMatrix();
      this.scale(5, 5, 5);  
      this.building.display();
      this.popMatrix();
    }

    if (this.displayLake) {
      this.pushMatrix();
      this.translate(this.lakeTX, 0, this.lakeTZ);
      this.setActiveShader(this.waterShader);
      this.waterMaterial.apply();
      this.waterMapTexture.bind(2);
      this.lake.display();
      this.setActiveShader(this.defaultShader);
      this.popMatrix();
    }

    if (this.displayForest) {
      this.pushMatrix();
      this.translate(this.forestTX, 0, this.forestTZ);
      this.scale(this.forestScale, this.forestScale, this.forestScale);  
      this.forest.display();
      this.popMatrix();
    }

    if (this.displayHeli) {
      this.pushMatrix();
    
      const scale = 5;
      const heightPerFloor = 1; 
      const buildingHeight = (this.numFloorsSide + 1) * heightPerFloor;
    
      const unitSize = 1; 
      const buildingCenterX = ((this.windowsPerFloor-3) * unitSize * scale) / 2;

      if (this.displayBuilding)
        this.translate(0, buildingHeight * scale + 5.6, -12 -buildingCenterX);
      else this.translate(0, 0, 0);
        // this.translate(0, 5.7, -12);

      this.scale(0.6, 0.6, 0.6);
      this.heli.display();
    
      this.popMatrix();
    }
  }

  initTextures() {
    this.textures = {
        wall: new CGFappearance(this),
        window: new CGFappearance(this),
        door: new CGFappearance(this),
        sign: new CGFappearance(this),
        helipad: new CGFappearance(this)
    };

    this.textures.wall.setAmbient(0.7, 0.7, 0.7, 1);
    this.textures.wall.setDiffuse(0.7, 0.7, 0.7, 1);
    this.textures.wall.setSpecular(0.1, 0.1, 0.1, 1);
    this.textures.wall.setShininess(10);

    this.textures.helipad.setAmbient(0.7, 0.7, 0.7, 1);
    this.textures.helipad.setDiffuse(0.7, 0.7, 0.7, 1);
    this.textures.helipad.setSpecular(0.1, 0.1, 0.1, 1);
    this.textures.helipad.setShininess(10);

    this.textures.sign.setAmbient(0.7, 0.7, 0.7, 1);
    this.textures.sign.setDiffuse(0.7, 0.7, 0.7, 1);
    this.textures.sign.setSpecular(0.1, 0.1, 0.1, 1);
    this.textures.sign.setShininess(10);

    this.textures.window.setAmbient(0.5, 0.5, 0.5, 1);
    this.textures.window.setDiffuse(0.8, 0.8, 0.8, 0.5); 
    this.textures.window.setSpecular(1.0, 1.0, 1.0, 0.5); 
    this.textures.window.setShininess(10);

    this.textures.door.setAmbient(0.5, 0.5, 0.5, 1);
    this.textures.door.setDiffuse(0.8, 0.8, 0.8, 0.5); 
    this.textures.door.setSpecular(1.0, 1.0, 1.0, 0.5); 
    this.textures.door.setShininess(10);
    
    this.textures.window.loadTexture("textures/window.png");
    this.textures.door.loadTexture("textures/door.png");
    this.textures.sign.loadTexture("textures/sign.png");
    this.textures.helipad.loadTexture("textures/helipad.png");
    this.textures.wall.loadTexture("textures/quartz.png");

    for (let key in this.textures) {
        this.textures[key].setTextureWrap('REPEAT', 'REPEAT');
    }

    this.treeTextures = [
      {wood: new CGFappearance(this),leaves: new CGFappearance(this)},
      {wood: new CGFappearance(this),leaves: new CGFappearance(this)},
      {wood: new CGFappearance(this),leaves: new CGFappearance(this)}
    ];
    
    const texturePaths = [
      { wood: 'textures/wood1.png', leaves: 'textures/leaves1.png' },
      { wood: 'textures/wood2.png', leaves: 'textures/leaves2.png' },
      { wood: 'textures/wood3.png', leaves: 'textures/leaves3.png' }
    ];
    
    for (let i = 0; i < 3; i++) {
      const woodMat = this.treeTextures[i].wood;
      woodMat.setAmbient(1, 1, 1, 1);
      woodMat.setDiffuse(1, 1, 1, 1);
      woodMat.setSpecular(0.1, 0.1, 0.1, 1);
      woodMat.setShininess(10.0);
      woodMat.loadTexture(texturePaths[i].wood);
      woodMat.setTextureWrap('REPEAT', 'REPEAT');
    
      const leafMat = this.treeTextures[i].leaves;
      leafMat.setAmbient(1, 1, 1, 1);
      leafMat.setDiffuse(1, 1, 1, 1);
      leafMat.setSpecular(0.1, 0.1, 0.1, 1);
      leafMat.setShininess(10.0);
      leafMat.loadTexture(texturePaths[i].leaves);
      leafMat.setTextureWrap('REPEAT', 'REPEAT');
    }

    this.shadowMaterial = new CGFappearance(this);
    this.shadowMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.shadowMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
    this.shadowMaterial.setSpecular(0, 0, 0, 1);
    this.shadowMaterial.setEmission(0.05, 0.05, 0.05, 1);
    this.shadowMaterial.loadTexture("textures/shader.png");
    this.shadowMaterial.setTextureWrap("REPEAT", "REPEAT");
    this.shadowMaterial.setShininess(1);

    this.textures.fire = new CGFappearance(this);
    this.textures.fire.setAmbient(0.9, 0.9, 0.9, 1.0);
    this.textures.fire.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.textures.fire.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.textures.fire.setShininess(100.0);
    this.textures.fire.loadTexture("textures/fire.png");
    this.textures.fire.setTextureWrap("REPEAT", "REPEAT");
  }

  initHeliTextures() {
    this.heliTextures = {
      body:    new CGFappearance(this),
      body2:   new CGFappearance(this),
      cockpit: new CGFappearance(this),
      blade:   new CGFappearance(this),
      black:   new CGFappearance(this),
      rope:    new CGFappearance(this),
    };

    this.heliTextures.rope.setAmbient (0.25, 0.18, 0.10, 1);
    this.heliTextures.rope.setDiffuse (0.75, 0.60, 0.40, 1);
    this.heliTextures.rope.setSpecular(0.10, 0.08, 0.05, 1);
    this.heliTextures.rope.setShininess(5);
    
    this.heliTextures.body.setAmbient(0.8, 0.8, 0.8, 1);
    this.heliTextures.body.setDiffuse(0.5, 0.5, 0.5, 1);
    this.heliTextures.body.setSpecular(0.9, 0.9, 0.9, 1);
    this.heliTextures.body.setShininess(100);
    this.heliTextures.body.loadTexture("textures/bodyTexture.png");
    this.heliTextures.body.setTextureWrap("REPEAT", "REPEAT");

    this.heliTextures.body2.setAmbient(0.8, 0.8, 0.8, 1);
    this.heliTextures.body2.setDiffuse(0.5, 0.5, 0.5, 1);
    this.heliTextures.body2.setSpecular(0.9, 0.9, 0.9, 1);
    this.heliTextures.body2.setShininess(100);
    this.heliTextures.body2.loadTexture("textures/heli_top.png");
    this.heliTextures.body2.setTextureWrap("REPEAT", "REPEAT");
  
    this.heliTextures.body2.setAmbient(0.3, 0.3, 0.3, 1);
    this.heliTextures.body2.setDiffuse(0.5, 0.5, 0.5, 1);
    this.heliTextures.body2.setSpecular(0.9, 0.9, 0.9, 1);
    this.heliTextures.cockpit.setShininess(100);
    this.heliTextures.cockpit.loadTexture("textures/window2.png");
    this.heliTextures.cockpit.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
  
    this.heliTextures.blade.setAmbient(0.6, 0.6, 0.6, 1);
    this.heliTextures.blade.setDiffuse(1, 1, 1, 1);
    this.heliTextures.blade.setSpecular(0.6, 0.6, 0.6, 1);
    this.heliTextures.blade.setShininess(200);
    this.heliTextures.blade.loadTexture("textures/iron.jpg");
    this.heliTextures.blade.setTextureWrap("REPEAT", "REPEAT");
  
    this.heliTextures.black.setAmbient(0.3, 0.3, 0.3, 1);
    this.heliTextures.black.setDiffuse(0.6, 0.6, 0.6, 1);
    this.heliTextures.black.setSpecular(0.9, 0.9, 0.9, 1);
    this.heliTextures.black.setShininess(90);
    this.heliTextures.black.loadTexture("textures/heli_bottom.png");
    this.heliTextures.black.setTextureWrap("REPEAT", "REPEAT");
  }

  getHeliWorldPosition() {
    const scale = 0.6;
    const buildingScale = 5;
    const heightPerFloor = 1;
    const buildingHeight = (this.numFloorsSide + 1) * heightPerFloor;
    const unitSize = 1;
    const buildingCenterX = ((this.windowsPerFloor - 3) * unitSize * buildingScale) / 2;
  
    const sceneTranslation = {
      x: 0,
      y: this.displayBuilding ? buildingHeight * buildingScale + 5.6 : 5.7,
      z: -12 - buildingCenterX
    };
  
    const worldX = sceneTranslation.x + this.heli.position.x * scale;
    const worldY = sceneTranslation.y + this.heli.position.y * scale;
    const worldZ = sceneTranslation.z + this.heli.position.z * scale;
  
    return { x: worldX, y: worldY, z: worldZ };
  }  
  
  checkKeys() {
    const heli = this.heli;
    if(this.displayHeli) {
      if (this.gui.isKeyPressed("KeyR")) {
        this.resetHeli();
      } 

      const worldPos = this.getHeliWorldPosition();

      if (heli.state === "flying" && !heli.isReturningToBase && heli.velocity === 0 && this.gui.isKeyPressed("KeyL") && !heli.isBucketFull) {
        if (this.heli.isOverLake(this.lakeTX, this.lakeTZ, this.lakeRadius-1, worldPos.x, worldPos.z) && !heli.isBucketFull) {
          console.log("OVER LAKE"); /* FAZER O HELICOPTERO DESCER ATE AO LAGO E O BALDE ENCHER */
          heli.collectWater(worldPos.y);
        } 
        else {
          console.log("Returning to helipad");
          heli.isReturningToBase = true;
          heli.initiateLandingSequence();
        }
      }

      if (this.gui.isKeyPressed("KeyP")) {
        if (heli.state === "landed") {
          heli.state = "taking_off";
          heli.velocity = 0; 
          console.log("Helicopter taking off");
        }

        if(heli.isBucketFull) {
          heli.backToCruiseAltitude();  
        }
      }

      if (this.gui.isKeyPressed("KeyO")) {
        if(heli.isOverForest(this.forestTX + 2, this.forestTZ + 2, this.forestTX + this.forestScale * 4 * 2, this.forestTZ + 2 * 5 * this.forestScale, worldPos.x, worldPos.z) && heli.isBucketFull && heli.isBucketFull && heli.velocity === 0) {
          console.log("OVER FOREST");
          heli.dropWater(); /* FAZER O HELICOPTERO LANÇAR A AGUA */
        }
      }

      if (heli.state === "flying") {
        if (this.gui.isKeyPressed("KeyW") && !heli.isCollectingWater && !heli.returningToCruise) {
          heli.accelerate(2 * this.speedFactor);
          heli.targetPitch = -heli.maxPitch; 
        } 
        if (this.gui.isKeyPressed("KeyS") && !heli.isCollectingWater && !heli.returningToCruise) {
          heli.accelerate(-3 * this.speedFactor);
          heli.targetPitch = heli.maxPitch;
        } 
        else {
          heli.targetPitch = 0; 
        }

        if (this.gui.isKeyPressed("KeyA") && !heli.isCollectingWater && !heli.returningToCruise) {
          heli.turn(0.05); 
          heli.targetRoll = heli.maxRoll;
          heli.tailBladeTargetSpeed = -heli.tailBladeMaxSpeed;
          console.log("Helicopter Left");
        }
        if (this.gui.isKeyPressed("KeyD") && !heli.isCollectingWater && !heli.returningToCruise) {
          heli.turn(-0.05); 
          heli.targetRoll = heli.maxRoll;
          heli.tailBladeTargetSpeed = +heli.tailBladeMaxSpeed;
          console.log("Helicopter Right");
        } 
        else {
          heli.targetRoll = 0;
          heli.tailBladeSpeed = 0;
        }

        if (this.gui.isKeyPressed("Space") && !heli.isCollectingWater && !heli.isReturningToBase) {
          heli.position.y += 0.5 * this.speedFactor;
          heli.targetPitch = -heli.maxPitch; 
        }
        if (this.gui.isKeyPressed("ShiftLeft") && !heli.isReturningToBase && !heli.isCollectingWater) {
          heli.position.y -= 0.5 * this.speedFactor;
          heli.targetPitch = heli.maxPitch; 
          if (heli.position.y <= 5) heli.position.y = 5;
        }
      }
    }
  }

  resetHeli() {
    const h = this.heli;
    h.position           = { ...h.initialPosition };
    h.velocity           = 0;
    h.state              = "landed";
    h.orientation        = 0;
    h.direction          = { x: 0, z: 1 };
    h.roll               = 0;
    h.targetRoll         = 0;
    h.pitch              = 0;
    h.targetPitch        = 0;
    h.bladeRotation      = 0;
    h.bladeRotationSpeed = 0;
    h.tailBladeRotation  = 0;
    h.tailBladeSpeed     = 0;
    h.tailBladeTargetSpeed = 0;
    h.hoverActive        = false;
    h.hoverTime          = 0;
    h.hoverOffsetX       = 0;
    h.hoverOffsetY       = 0;
    h.hoverOffsetZ       = 0;
    h.isCollectingWater  = false;
    h.isBucketFull       = false;
    h.waterCollectionTime= 0;
    h.bucketDropOffsetY  = 0;
    h.returningToCruise  = false;
    h.isReturningToBase  = false;
    h.targetAltitude     = undefined; 
    h.turningLeft        = false;
    h.turningRight       = false;
  }
  
}
