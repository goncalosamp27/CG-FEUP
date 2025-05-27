
import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js"
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";
import { MyFire } from "./MyFire.js";

export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    this.followPanorama = true;
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
    this.forestRows = 5;
    this.forestCols = 4;
    this.forestSpacing  = 3.5;
    this.realisticFire = false;
    this.fireSpreadInterval = 3000;
    this.lastFireSpreadTime = 0;
    this.heliscale = 0.35;

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

    this.panoramaTexture = new CGFappearance(this);
    this.panoramaTexture.setEmission(1.0, 1.0, 1.0, 1.0);
    this.panoramaTexture.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.panoramaTexture.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.panoramaTexture.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.panoramaTexture.setShininess(0.0);
    this.panoramaTexture.loadTexture("textures/background.jpg");
    this.panoramaTexture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

    this.panorama = new MyPanorama(this, this.panoramaTexture);

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
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestSpacing);

    this.heli = new MyHeli(this, this.heliTextures, this.cruiseAltitude);

    this.waterMaterial = new CGFappearance(this);
    this.waterMaterial.setAmbient(0.4, 0.6, 1.0, 0.8);  
    this.waterMaterial.setDiffuse(0.4, 0.6, 1.0, 0.8);
    this.waterMaterial.setSpecular(0.5, 0.5, 0.5, 0.8); 
    this.waterMaterial.loadTexture("textures/waterTex.jpg");
    this.waterMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({ uSampler2: 2, uSampler2: 2, timeFactor: 0 });

    this.waterMapTexture = new CGFtexture(this, "textures/waterMap.jpg");

    this.lakeRadius = 10;
    this.lakeTX = -30;
    this.lakeTZ = 15;
    this.lake = new MyLake(this, this.lakeRadius, 0.1);

    this.forestTX = 30;
    this.forestTZ = 10;
    this.forestScale = 3.2;

    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({ uSampler: 1, timeFactor: 0 });

    this.nextFireSpreadDelay = 2000 + Math.random() * 3000;

    this.waterDropMaterial = new CGFappearance(this);
    this.waterDropMaterial.setAmbient(0.7, 0.7, 1.0, 1.0);    
    this.waterDropMaterial.setDiffuse(0.7, 0.9, 1.0, 1.0);    
    this.waterDropMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);  
    this.waterDropMaterial.setEmission(0.2, 0.3, 0.5, 1.0); 
    this.waterDropMaterial.loadTexture("textures/waterTex.jpg");
    this.waterDropMaterial.setTextureWrap('REPEAT', 'REPEAT');
    this.waterDropMaterial.setShininess(100);               

    this.fallingWaterSpheres = [];

    this.cloudsTexture = new CGFtexture(this, "textures/clouds.jpg")
    this.cloudShader = new CGFshader(this.gl, "shaders/cloud.vert", "shaders/cloud.frag");
    this.cloudShader.setUniformsValues({ uSampler2: 1, timeFactor: 0, cloudHeight:  0.07 }); 

    this.windFactor = 3;
  }
  
  initLights() {
    this.lights[0].setPosition(100, 100, 100, 1);
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
    this.time = t;
    
    this.checkKeys();
    this.building.update(t);
    this.heli.update(t);
    this.waterShader.setUniformsValues({ timeFactor: this.windFactor / 2  * t / 100.0 % 1000 });
    this.fireShader.setUniformsValues({ timeFactor: this.windFactor / 4 * t / 100.0 % 1000 });
    this.cloudShader.setUniformsValues({ uSampler2: 1,  timeFactor: this.windFactor * (t / 400.0) % 1000 });

    if (this.realisticFire && !this.fireAlreadyStarted && !this.displayFire) {
        const randomTreeData = this.forest.trees[Math.floor(Math.random() * this.forest.trees.length)];
        const randomTree = randomTreeData.tree;

        if (!randomTree.hasFire) {
            const fire = new MyFire(this);
            fire.rotationAngle = Math.random() * Math.PI / 2;
            randomTree.setOnFire(fire);
        }

        this.fireAlreadyStarted = true;
        this.lastFireSpreadTime = t;
        this.nextFireSpreadDelay = 2000 + Math.random() * 3000;
    }

    if (this.displayFire && !this.fireAlreadyStarted && !this.realisticFire) {
        const shuffledTrees = [...this.forest.trees].sort(() => Math.random() - 0.5);
        const totalTrees = shuffledTrees.length;
        const treesOnFireCount = Math.floor(0.7 * totalTrees);

        for (let i = 0; i < treesOnFireCount; i++) {
            const { tree } = shuffledTrees[i];
            if (!tree.hasFire) {
                const fire = new MyFire(this);
                fire.rotationAngle = Math.random() * Math.PI / 2;
                tree.setOnFire(fire);
            }
        }

        this.fireAlreadyStarted = true;
    }
    const baseInterval = Math.pow(this.forestSpacing, 1.2) * 500;
    const windMultiplier = 1.0 - (Math.min(this.windFactor, 10) / 3) * 0.8;
    const dynamicSpreadInterval = baseInterval * windMultiplier;

    if (this.realisticFire && t - this.lastFireSpreadTime > dynamicSpreadInterval + this.nextFireSpreadDelay) {
        this.spreadFire();
        this.lastFireSpreadTime = t;
        this.nextFireSpreadDelay = 2000 + Math.random() * 3000;
    }

     if (!this.displayFire && !this.realisticFire && this.fireAlreadyStarted) {
      this.forest.trees.forEach(({ tree }) => {
        if (tree.hasFire && tree.fire && !tree.fire.isExtinguishing) {
          tree.fire.startExtinguish(t);
        }
      });

      const allFiresGone = this.forest.trees.every(({ tree }) => {
        return !tree.hasFire || (tree.fire && tree.fire.isExtinguishing && tree.fire.getCurrentScale(t) === 0);
      });

      if (allFiresGone) {
        this.forest.trees.forEach(({ tree }) => {
          tree.hasFire = false;
          tree.fire = null;
        });
        this.fireAlreadyStarted = false;
      }
    }

    // AGUA
    for (const drop of this.fallingWaterSpheres) {
      if (!drop.active) continue;

      drop.lifetime += 0.05;

      drop.velocity += 9.8 * 0.05;
      drop.y -= drop.velocity * 0.05;

      const dx = Math.cos(drop.dirAngle) * drop.spreadSpeed * drop.lifetime * 20;
      const dz = Math.sin(drop.dirAngle) * drop.spreadSpeed * drop.lifetime * 20;

      drop.x = drop.initialX + dx;
      drop.z = drop.initialZ + dz;

      if (drop.y <= -2) {
        drop.active = false;
      }
    }


    if (this.fallingWaterSpheres.length > 0 && this.fallingWaterSpheres.every(s => !s.active)) {

      this.forest.trees.forEach(({ tree }) => {
        if (tree.hasFire && tree.fire && !tree.fire.isExtinguishing) {
          tree.fire.startExtinguish(t);
        }
      });

      const allFiresGone = this.forest.trees.every(({ tree }) => {
        return !tree.hasFire || (tree.fire && tree.fire.isExtinguishing && tree.fire.getCurrentScale(t) === 0);
      });

      if (allFiresGone) {
        this.forest.trees.forEach(({ tree }) => {
          tree.hasFire = false;
          tree.fire = null;
        });

        this.fallingWaterSpheres = [];
      }
    }

    // AGUA
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
      this.textures.helipad,
      this.helipadTextures,
      this.signalLightBaseMaterial,
      this.signalLightPulseMaterial
    );    
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();
    
    
    if (this.displayAxis) {
      this.setDefaultAppearance();
      this.axis.display();
    }

    if(this.displayPanorama) {
      this.pushMatrix();
      this.cloudsTexture.bind(1);

      if (this.followPanorama) this.translate(0,-25,0);
      else this.translate(0,-17,0);

      this.setActiveShader(this.cloudShader);
      this.panoramaTexture.texture.bind(0);
      this.panorama.display();
      this.setDefaultAppearance();
      this.setActiveShader(this.defaultShader);
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
      this.building.display(this.heli.state, this.time);
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


    if (this.displayHeli) {
      this.pushMatrix();
    
      const scale = 5;
      const heightPerFloor = 1; 
      const buildingHeight = (this.numFloorsSide + 1) * heightPerFloor;
    
      const unitSize = 1; 
      const buildingCenterX = ((this.windowsPerFloor-3) * unitSize * scale) / 2;

      if (this.displayBuilding)
        this.translate(0, buildingHeight * scale + 3.3, -12 -buildingCenterX);
      else 
        this.translate(0, 3.3, -12);
        // this.translate(0, 5.7, -12);

      this.scale(this.heliscale, this.heliscale, this.heliscale);
      this.heli.display();
    
      this.popMatrix();
    }

    for (const drop of this.fallingWaterSpheres) {
      if (!drop.active) continue;

      this.pushMatrix();
      this.translate(drop.x, drop.y, drop.z);
      
      const sxz = drop.scaleXZ || 0.8;
      const sy = drop.scaleY || 1.5;
      this.scale(sxz, sy, sxz); 

      this.waterDropMaterial.apply(); 
      drop.sphere.display();
      this.popMatrix();
    }

    if (this.displayForest) {
      this.pushMatrix();
      this.translate(this.forestTX, 0, this.forestTZ);
      this.scale(this.forestScale, this.forestScale, this.forestScale);  
      this.forest.display(this.time);
      this.popMatrix();
    }
  }

  initTextures() {
    this.fireTexture = new CGFtexture(this, "textures/fire.png");

    this.textures = {
        wall: new CGFappearance(this),
        window: new CGFappearance(this),
        door: new CGFappearance(this),
        sign: new CGFappearance(this),
        helipad: new CGFappearance(this),
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
    this.textures.wall.loadTexture("textures/quartz.jpg");
    
    for (let key in this.textures) {
      if (this.textures[key] instanceof CGFappearance) {
        this.textures[key].setTextureWrap('REPEAT', 'REPEAT');
      }
    }

    this.helipadTextures = {
      normal: new CGFtexture(this, "textures/helipad.png"),
      up:     new CGFtexture(this, "textures/helipadUP.png"),
      down:   new CGFtexture(this, "textures/helipadDOWN.png")
    };

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

    this.signalLightBaseMaterial = new CGFappearance(this);
    this.signalLightBaseMaterial.setAmbient(0.3, 0.3, 0.3, 1);
    this.signalLightBaseMaterial.setDiffuse(0.4, 0.4, 0.4, 1);
    this.signalLightBaseMaterial.setSpecular(0.6, 0.6, 0.6, 1);
    this.signalLightBaseMaterial.setShininess(50);

    this.signalLightPulseMaterial = new CGFappearance(this);
    this.signalLightPulseMaterial.setAmbient(0.3, 0.3, 0.3, 1);
    this.signalLightPulseMaterial.setDiffuse(0.4, 0.4, 0.4, 1);
    this.signalLightPulseMaterial.setSpecular(0.6, 0.6, 0.6, 1);
    this.signalLightPulseMaterial.setShininess(50);
    this.signalLightPulseMaterial.setEmission(0, 0, 0, 1);
  }

  getHeliWorldPosition() {
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
  
    const worldX = sceneTranslation.x + this.heli.position.x * this.heliscale;
    const worldY = sceneTranslation.y + this.heli.position.y * this.heliscale;
    const worldZ = sceneTranslation.z + this.heli.position.z * this.heliscale;
  
    return { x: worldX, y: worldY, z: worldZ };
  }  
  
  checkKeys() {
    const heli = this.heli;
    const worldPos = this.getHeliWorldPosition();

    if(this.displayHeli) {
      if (this.gui.isKeyPressed("KeyR")) {
        this.resetHeli();
      } 

      if (heli.state === "flying" && !heli.isReturningToBase && heli.velocity === 0 && this.gui.isKeyPressed("KeyL") && !heli.isBucketFull) {
        if (this.heli.isOverLake(this.lakeTX, this.lakeTZ, this.lakeRadius-1, worldPos.x, worldPos.z) && !heli.isBucketFull) {
          console.log("OVER LAKE"); 
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

      if (this.gui.isKeyPressed("KeyO") && heli.isBucketFull) {
        const { x, z } = this.getHeliWorldPosition();
        const bounds = this.getForestBounds();

        if (x >= bounds.minX && x <= bounds.maxX &&
            z >= bounds.minZ && z <= bounds.maxZ) {
          this.heli.dropWater();
        }
      }

     // test if (this.gui.isKeyPressed("KeyO")) this.heli.dropWater();

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

        if (this.gui.isKeyPressed("KeyA")) {
          heli.turn(0.05); 
          heli.targetRoll = heli.maxRoll;
          heli.tailBladeTargetSpeed = -heli.tailBladeMaxSpeed;
          console.log("Helicopter Left");
        }
        if (this.gui.isKeyPressed("KeyD")) {
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

  updateForest() {
  this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestSpacing);

  // Reset ao estado de fogo
  this.fireAlreadyStarted = false;
  this.lastFireSpreadTime = 0;

  if (this.displayFire && !this.realisticFire && !this.fireAlreadyStarted) {
  const shuffledTrees = [...this.forest.trees].sort(() => Math.random() - 0.5);
  const totalTrees = shuffledTrees.length;
  const treesOnFireCount = Math.floor(0.7 * totalTrees);

  for (let i = 0; i < treesOnFireCount; i++) {
    const { tree } = shuffledTrees[i];
    if (!tree.hasFire) {
      const fire = new MyFire(this);
      fire.rotationAngle = Math.random() * Math.PI / 2;
      tree.setOnFire(fire);
    }
  }

  this.fireAlreadyStarted = true;
}

}


  spreadFire() {
    const candidates = [];
    const fireSpreadDistance = this.forestSpacing * 1.5;

    this.forest.trees.forEach(({ tree: currentTree, x: x1, z: z1 }) => {
      if (currentTree.hasFire) {
        this.forest.trees.forEach(({ tree: neighborTree, x: x2, z: z2 }) => {
          if (!neighborTree.hasFire) {
            const dist = Math.hypot(x1 - x2, z1 - z2);
            if (dist <= fireSpreadDistance) {
              candidates.push(neighborTree);
            }
          }
        });
      }
    });

    const uniqueCandidates = [...new Set(candidates)];
    const shuffled = uniqueCandidates.sort(() => Math.random() - 0.5);
    const percentage = 0.2 + Math.random() * 0.2; // entre 20% e 40%
    const maxToIgnite = Math.ceil(shuffled.length * percentage);

    for (let i = 0; i < Math.min(maxToIgnite, shuffled.length); i++) {
      const tree = shuffled[i];
      const fire = new MyFire(this);
      fire.rotationAngle = Math.random() * Math.PI / 2;
      tree.setOnFire(fire);
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
  
  startWaterDrop(x, y, z) {
  const numSpheres = 100;

  for (let i = 0; i < numSpheres; i++) {
    const scaleXZ = 0.3 + Math.random() * 0.6;
    const scaleY = 0.4 + Math.random() * 0.7;  
    const speed = 2 + Math.random() * 3; 

    const dirAngle = Math.random() * 2 * Math.PI;
    const spreadSpeed = 0.1 + Math.random() * 0.2; 

    this.fallingWaterSpheres.push({
      sphere: new MySphere(this, 0.5, 16, 8, false),
      x: x,
      y: y,
      z: z,
      initialX: x,
      initialZ: z,
      velocity: speed,
      spreadSpeed: spreadSpeed,
      dirAngle: dirAngle,
      active: true,
      scaleXZ: scaleXZ,
      scaleY: scaleY,
      lifetime: 0
    });
  }
}

  getForestBounds() {
    const treeWorldX = this.forest.trees.map(t => t.x * this.forestScale + this.forestTX);
    const treeWorldZ = this.forest.trees.map(t => t.z * this.forestScale + this.forestTZ);

    const minX = Math.min(...treeWorldX);
    const maxX = Math.max(...treeWorldX);
    const minZ = Math.min(...treeWorldZ);
    const maxZ = Math.max(...treeWorldZ);

    return { minX, maxX, minZ, maxZ };
  }
}
