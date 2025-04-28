
import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js"
import { MyForest } from "./MyForest.js";
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
    this.displayPanorama = false;
    this.displayBuilding = true;
    this.displayForest = true;

    super.init(application);
    this.initTextures();
    
    // this.zz = 0;
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
    this.plane = new MyPlane(this, 64, 0, 10, 0, 10);
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
    this.grassMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.grassMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
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
      vec3.fromValues(20, 20, 20),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();

    // this.zz += 0.1;
  }

  updateBuilding() {
    this.buildBuilding();
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
      this.panorama.display();
      this.setDefaultAppearance();
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

    if (this.displayForest) {
      this.pushMatrix();
      this.scale(1.8, 1.8, 1.8);  
      this.translate(10, 0, 5);
      this.forest.display();
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
  }
}
