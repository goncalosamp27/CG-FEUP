import { MyPlane } from './MyPlane.js';  
import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from './MyWindow.js';  

export class MyBuilding {
  constructor(scene, numFloorsSide,windowsperfloor, windowTexture, color, wallMaterial, doorMaterial, signMaterial, helipadMaterial) {
    this.scene = scene;
    this.numFloorsSide = numFloorsSide;
    this.windowsperfloor = windowsperfloor;
    this.windowTexture = windowTexture;
    this.color = color; 
    this.wallMaterial = wallMaterial;
    this.doorTexture = doorMaterial;
    this.signTexture = signMaterial;
    this.helipadTexture = helipadMaterial;

    this.totalWidth = this.windowsperfloor * 3;

    this.initModules();

    this.wall = new MyPlane(scene, 10, 0, 1, 0, 1);
    this.roof = new MyPlane(scene, 10);  
    this.sign = new MyPlane(scene, 10);  
    this.door = new MyPlane(scene, 10);  
    this.window = new MyWindow(scene, 1, 1, this.windowTexture);
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

    // Função auxiliar para desenhar uma parede
    const drawWall = (translateVec, rotateVec, scaleVec, isDepth) => {
        this.scene.pushMatrix();
        this.scene.translate(...translateVec);
        if (rotateVec)
            this.scene.rotate(...rotateVec);
        this.scene.scale(...scaleVec);

        if (isDepth)
            this.wall.updateTexCoordsAmplify(width * 2, height * 2);
        else
            this.wall.updateTexCoordsAmplify(width * 2, height * 2); 

        this.wallMaterial.apply();
        this.wall.display();
        this.scene.popMatrix();
    };

    drawWall([xOffset, height / 2, 0], null, [width, height, 1], false);
    drawWall([xOffset, height / 2, -depth], [Math.PI, 0, 1, 0], [width, height, 1], false);
    drawWall([xOffset + width / 2, height / 2, -depth / 2], [Math.PI / 2, 0, 1, 0], [depth, height, 1], true);
    drawWall([xOffset - width / 2, height / 2, -depth / 2], [-Math.PI / 2, 0, 1, 0], [depth, height, 1], true);

    // Roof
    this.scene.pushMatrix();
    this.scene.translate(xOffset, height, -depth/2);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(width, depth, 1);
    this.roof.updateTexCoordsAmplify(width * 2, depth * 2);
    this.wallMaterial.apply();
    this.roof.display();
    this.scene.popMatrix();

    // Windows
    for (let floor = 0; floor < floors; floor++) {
        for (let i = 0; i < this.windowsperfloor; i++) {
            if (center && floor === 0) continue;
            const xPos = xOffset - width / 2 + (i + 1) * (width / (this.windowsperfloor + 1));
            const yPos = (floor + 0.5) * this.floorHeight;
            this.scene.pushMatrix();
            this.scene.translate(xPos, yPos, 0.01);
            this.scene.scale(0.5, 0.5, 1);
            this.window.display();
            this.scene.popMatrix();
        }
    }
}

}
