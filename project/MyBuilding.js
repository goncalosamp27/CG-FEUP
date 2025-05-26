import { MyPlane } from './MyPlane.js';  
import { MyWindow } from './MyWindow.js';  
import { MyPrism } from './MyPrism.js';
import { MySphere } from './MySphere.js';

export class MyBuilding {
  constructor(scene, numFloorsSide,windowsperfloor, windowTexture, color, wallMaterial, doorMaterial, signMaterial, helipadMaterial,  helipadTextures, signalLightBaseMaterial, signalLightPulseMaterial) {
    this.scene = scene;
    this.numFloorsSide = numFloorsSide;
    this.windowsperfloor = windowsperfloor;
    this.windowTexture = windowTexture;
    this.color = color; 
    this.wallMaterial = wallMaterial;
    this.doorTexture = doorMaterial;
    this.signTexture = signMaterial;
    this.helipadTexture = helipadMaterial;
    this.helipadTextures = helipadTextures;
    this.signalLightBaseMaterial = signalLightBaseMaterial;
    this.signalLightPulseMaterial = signalLightPulseMaterial;

    this.totalWidth = this.windowsperfloor * 3;

    this.initModules();

    this.wall = new MyPlane(scene, 10, 0, 1, 0, 1);
    this.roof = new MyPlane(scene, 10);  
    this.sign = new MyPlane(scene, 10);  
    this.door = new MyPlane(scene, 10);  
    this.window = new MyWindow(scene, 1, 1, this.windowTexture);
    this.helipad = new MyPlane(scene, 10);  

    this.signalLights = [
      new MyPrism(scene, 8, 0.10, 0.06),
      new MyPrism(scene, 8, 0.10, 0.06),
      new MyPrism(scene, 8, 0.10, 0.06),
      new MyPrism(scene, 8, 0.10, 0.06)
    ];

    this.signalLightSpheres = [
      new MySphere(scene, 0.053, 12, 6),
      new MySphere(scene, 0.053, 12, 6),
      new MySphere(scene, 0.053, 12, 6),
      new MySphere(scene, 0.053, 12, 6)
    ];
  }

  initModules() {
    this.centralWidth = this.totalWidth * 0.4;
    this.sideWidth = this.centralWidth * 0.75;
    this.floorHeight = 1.0;
    this.centralFloors = this.numFloorsSide + 1;
    this.centralDepth= this.centralWidth;
    this.depth = this.sideWidth;

    let y = this.floorHeight * this.centralFloors;
    let offset = this.centralWidth / 2; 

    this.signalLightsTransforms = [
      { x:  offset - 0.1, y: y, z:  -0.1 }, 
      { x: -offset + 0.1, y: y, z:  -0.1 }, 
      { x:  offset - 0.1, y: y, z: -2* offset + 0.1}, 
      { x: -offset + 0.1, y: y, z: -2* offset + 0.1}  
    ];
  }

  update(t) {
    if (!this.signalLightPulseMaterial) return; 

    const state = this.scene.heli.state;
    const inManoeuvre = (state === "landing" || state === "taking_off");

    if (!inManoeuvre) return;

    const frequency = 2.0;
    const timeInSeconds = t / 1000.0;
    const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * frequency * timeInSeconds);

    this.signalLightPulseMaterial.setEmission(pulse, 0, 0, 1);
  }


  display(heliState, time) {
    const helipadWidth  = this.centralWidth * 0.7;
    const helipadDepth  = this.centralWidth * 0.7;
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0);
    this.displayModule(this.centralFloors, this.centralWidth, 0, true, this.centralDepth);
    this.scene.popMatrix();

    for (let i = 0; i < this.signalLights.length; i++) {
      const { x, y, z } = this.signalLightsTransforms[i];
      this.scene.pushMatrix();
      this.scene.translate(x, y, z);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);

      const state = this.scene.heli.state;
      const inManoeuvre = (state === "landing" || state === "taking_off");

      this.scene.signalLightBaseMaterial.apply();

      this.signalLights[i].display();

      this.scene.pushMatrix();
      this.scene.translate(0, 0, 0.1); 
      if (inManoeuvre) {
        this.signalLightPulseMaterial.apply();
      } else {
        this.signalLightBaseMaterial.apply(); // esfera apagada quando não em manobra
      }
      this.signalLightSpheres[i].display();
      this.scene.popMatrix();
      this.scene.popMatrix();
    }


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

    this.scene.translate(
      0,
      this.centralFloors * this.floorHeight + 0.01,
      -helipadDepth / 1.37
    );
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(helipadWidth, helipadDepth, 1);

    
    let textureToUse = this.helipadTextures.normal;
    if (heliState === "taking_off") textureToUse = this.helipadTextures.up;
    if (heliState === "landing")    textureToUse = this.helipadTextures.down;

    if ((heliState === "taking_off" || heliState === "landing") && Math.floor(time / 300) % 2 === 0) {
      textureToUse = this.helipadTextures.normal;
    }

    this.helipadTexture.setTexture(textureToUse); 
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
            this.wall.updateTexCoordsAmplify(width * 0.8, height * 0.8);
        else
            this.wall.updateTexCoordsAmplify(width * 0.8, height * 0.8); 

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
    this.roof.updateTexCoordsAmplify(width * 0.8, depth * 0.8);
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
