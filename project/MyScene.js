import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
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
      0.4,
      0.1,
      1000,
      vec3.fromValues(200, 200, 200),
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

    // Draw axis
    this.axis.display();
    this.setDefaultAppearance();

    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.grassMaterial.apply();
    // this.plane.display();
    this.popMatrix();

    this.pushMatrix();
    this.rotate(3*Math.PI / 4, 0, 1, 0);
    this.earthMaterial.apply();
    this.sphere.display();
    this.popMatrix();
  }
}
