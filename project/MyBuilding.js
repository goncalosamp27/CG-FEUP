import { MyPlane } from './MyPlane.js';  
import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from './MyWindow.js';  

export class MyBuilding {
  constructor(scene, numFloorsSide,windowsperfloor, windowTexture, color) {
    this.scene = scene;
    this.numFloorsSide = numFloorsSide;
    this.windowsperfloor = windowsperfloor;
    this.windowTexture = windowTexture;
    this.color = color; 

    this.totalWidth = this.windowsperfloor * 3;

    this.initModules();

    this.wallMaterial = new CGFappearance(scene);
    this.wallMaterial.setAmbient(...this.color, 1);
    this.wallMaterial.setDiffuse(...this.color, 1); 
    this.wallMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.wallMaterial.setShininess(10); 

    this.wall = new MyPlane(scene, 10);
    this.roof = new MyPlane(scene, 10);  

    this.signTexture = new CGFappearance(scene);
    this.signTexture.setAmbient(1, 1, 1, 1);
    this.signTexture.setDiffuse(1, 1, 1, 1);
    this.signTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.signTexture.setShininess(10.0);
    this.signTexture.loadTexture("textures/sign.png");
    this.signTexture.setTextureWrap('REPEAT', 'REPEAT');
    this.sign = new MyPlane(scene, 10);  

    this.doorTexture = new CGFappearance(scene);
    this.doorTexture.setAmbient(1, 1, 1, 1);
    this.doorTexture.setDiffuse(1, 1, 1, 1);
    this.doorTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.doorTexture.setShininess(10.0);
    this.doorTexture.loadTexture("textures/door.png");  
    this.doorTexture.setTextureWrap('REPEAT', 'REPEAT');
    this.door = new MyPlane(scene, 10);  

    this.window = new MyWindow(scene, 1, 1, this.windowTexture);

    this.helipadTexture = new CGFappearance(scene);
    this.helipadTexture.setAmbient(1, 1, 1, 1);
    this.helipadTexture.setDiffuse(1, 1, 1, 1);
    this.helipadTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.helipadTexture.setShininess(10.0);
    this.helipadTexture.loadTexture("textures/helipad.png");
    this.helipadTexture.setTextureWrap('REPEAT', 'REPEAT');
    this.helipad = new MyPlane(scene, 10);  
  }

  initModules() {
    this.centralWidth = this.totalWidth * 0.4;
    this.sideWidth = this.centralWidth * 0.75;
    this.floorHeight = 1.0;
    this.centralFloors = this.numFloorsSide + 1;
    this.centralDepth= this.centralWidth;
    this.depth = this.sideWidth;
  }

  display() {
    // Central Module (one more floor)
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0);
    this.displayModule(this.centralFloors, this.centralWidth, 0, true, this.centralDepth);
    this.scene.popMatrix();

    // Left Module (side module width)
    this.scene.pushMatrix();
    this.scene.translate(-this.centralWidth * 0.875, 0, -((this.centralDepth - this.depth) / 2));
    this.displayModule(this.numFloorsSide, this.sideWidth, 0, false);  
    this.scene.popMatrix();

    // Right Module (side module width)
    this.scene.pushMatrix();
    this.scene.translate(this.centralWidth * 0.875, 0, -((this.centralDepth - this.depth) / 2)); 
    this.displayModule(this.numFloorsSide, this.sideWidth, 0, false); 
    this.scene.popMatrix();

        // --- Draw Door ---
    this.scene.pushMatrix();
    this.scene.translate(0, 0.35, 0.01);
    this.scene.scale(0.7, 0.7, 1);
    this.doorTexture.apply();  
    this.door.display();
    this.scene.popMatrix();

    // --- Draw Sign ---
    this.scene.pushMatrix();
    this.scene.translate(0, this.floorHeight*0.97, 0.01);
    this.scene.scale(1, 0.4, 1);
    this.signTexture.apply();  
    this.sign.display();
    this.scene.popMatrix();

    
    this.scene.pushMatrix();
    const helipadWidth  = this.centralWidth * 0.7;
    const helipadDepth  = this.centralWidth * 0.7;

    this.scene.translate(
      0,
      this.centralFloors * this.floorHeight + 0.01,
      -helipadDepth / 1.37
    );
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(helipadWidth, helipadDepth, 1);

    this.helipadTexture.apply();
    this.helipad.display();
    this.scene.popMatrix();
  }

  displayModule(floors, width, xOffset, center = false, depthOverride = null) {
    const height = floors * this.floorHeight;  
    const depth = depthOverride !== null ? depthOverride : this.depth;

    // Front wall (normal positioning)
    this.scene.pushMatrix();
    this.scene.translate(xOffset, height / 2, 0);  
    this.scene.scale(width, height, 1); 
    this.wallMaterial.apply(); 
    this.wall.display();  
    this.scene.popMatrix();

    // Back wall (rotated 180 degrees)
    this.scene.pushMatrix();
    this.scene.translate(xOffset, height / 2, -depth);  
    this.scene.rotate(Math.PI, 0, 1, 0);  
    this.scene.scale(width, height, 1);  
    this.wallMaterial.apply(); 
    this.wall.display(); 
    this.scene.popMatrix();

    // Right wall (rotated 90°)
    this.scene.pushMatrix();
    this.scene.translate(xOffset + width / 2, height / 2, -depth / 2);  
    this.scene.rotate(Math.PI / 2, 0, 1, 0);  
    this.scene.scale(depth, height, 1);  
    this.wallMaterial.apply();  
    this.wall.display(); 
    this.scene.popMatrix();

    // Left wall (rotated -90°)
    this.scene.pushMatrix();
    this.scene.translate(xOffset - width / 2, height / 2, -depth / 2);  
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.scale(depth, height, 1); 
    this.wallMaterial.apply(); 
    this.wall.display(); 
    this.scene.popMatrix();

    if (center) {
        // Left side wall
        this.scene.pushMatrix();
        this.scene.translate(xOffset - width / 2 - 0.1, height / 2, -depth / 2);  
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);  
        this.scene.scale(depth, height, 1); 
        this.wallMaterial.apply(); 
        this.scene.popMatrix();

        // Right side wall
        this.scene.pushMatrix();
        this.scene.translate(xOffset + width / 2 + 0.1, height / 2, -depth / 2);  
        this.scene.rotate(Math.PI / 2, 0, 1, 0); 
        this.scene.scale(depth, height, 1);  
        this.wallMaterial.apply();  
        this.scene.popMatrix();
    }

     // Roof 
     this.scene.pushMatrix();
     this.scene.translate(xOffset, height, -depth/2);
     this.scene.rotate(-Math.PI / 2, 1, 0, 0);
     this.scene.scale(width, depth, 1);
     this.wallMaterial.apply();  
     this.roof.display(); 
     this.scene.popMatrix();

     // JANELAS
     for (let floor = 0; floor < floors; floor++) {
        for (let i = 0; i < this.windowsperfloor; i++) {
            if (center && floor === 0) continue;
            const xPos = xOffset - width / 2 + (i + 1) * (width / (this.windowsperfloor + 1));
            let yPos = (floor + 0.5) * this.floorHeight;  
            this.scene.pushMatrix();
            this.scene.translate(xPos, yPos, 0.01); 
            this.scene.scale(0.5, 0.5, 1); 
            this.window.display();  
            this.scene.popMatrix();
        }
    }

    /*
    for (let floor = 0; floor < floors; floor++) {
      for (let i = 0; i < this.windowsperfloor; i++) {
        if (center && floor === 0) continue;
        const zPos = - (i+1)*(depth/(this.windowsperfloor+1));  
        const yPos = (floor + .5)*this.floorHeight;
        this.scene.pushMatrix();
        this.scene.translate(xOffset + width/2 + 0.01, yPos, zPos);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 1);
        this.window.display();
        this.scene.popMatrix();
      }
    }

    for (let floor = 0; floor < floors; floor++) {
      for (let i = 0; i < this.windowsperfloor; i++) {
        if (center && floor === 0) continue;
        const zPos = - (i+1)*(depth/(this.windowsperfloor+1));
        const yPos = (floor + .5)*this.floorHeight;
        this.scene.pushMatrix();
        this.scene.translate(xOffset - width/2 - 0.01, yPos, zPos);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 1);
        this.window.display();
        this.scene.popMatrix();
      }
    }
    */
  }
}
