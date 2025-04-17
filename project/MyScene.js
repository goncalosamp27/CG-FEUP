
import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import {MyWindow} from "./MyWindow.js"
import {MyBuilding} from "./MyBuilding.js"

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

    super.init(application);
    
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

    const windowTexture = "textures/window.png";
  

    this.helipadTexture = new CGFappearance(this);
    this.helipadTexture.setAmbient(1, 1, 1, 1);
    this.helipadTexture.setDiffuse(1, 1, 1, 1);
    this.helipadTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.helipadTexture.setShininess(10.0);
    this.helipadTexture.loadTexture("textures/helipad.jpg");
    this.helipadTexture.setTextureWrap('REPEAT', 'REPEAT');

    this.building = new MyBuilding(this, 9, 3, 3, windowTexture, [0.82, 0.82, 0.82]);
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
    
    
  }
}
