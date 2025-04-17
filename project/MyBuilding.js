import { MyPlane } from './MyPlane.js';  // Import the MyPlane class
import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from './MyWindow.js';  // Import the MyWindow class

export class MyBuilding {
  constructor(scene, totalWidth, numFloorsSide,windowsperfloor, windowTexture, color) {
    this.scene = scene;
    this.totalWidth = totalWidth;
    this.numFloorsSide = numFloorsSide;
    this.windowsperfloor = windowsperfloor;
    this.windowTexture = windowTexture;
    this.color = color; // Color for the walls

    this.initModules();

    // Create the material for the walls
    this.wallMaterial = new CGFappearance(scene);
    this.wallMaterial.setAmbient(...this.color, 1); // Set the ambient light color
    this.wallMaterial.setDiffuse(...this.color, 1); // Set the diffuse light color
    this.wallMaterial.setSpecular(0.1, 0.1, 0.1, 1); // Set specular color (shiny highlights)
    this.wallMaterial.setShininess(5); // Set shininess value

    // Create the wall and roof plane objects for rendering
    this.wall = new MyPlane(scene, 10);
    this.roof = new MyPlane(scene, 10);  

    this.signTexture = new CGFappearance(scene);
    this.signTexture.setAmbient(1, 1, 1, 1);
    this.signTexture.setDiffuse(1, 1, 1, 1);
    this.signTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.signTexture.setShininess(10.0);
    this.signTexture.loadTexture("textures/sign.png");
    this.signTexture.setTextureWrap('REPEAT', 'REPEAT');
    this.sign = new MyPlane(scene, 10);  // Create sign object using MyPlane

    this.doorTexture = new CGFappearance(scene);
    this.doorTexture.setAmbient(1, 1, 1, 1);
    this.doorTexture.setDiffuse(1, 1, 1, 1);
    this.doorTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.doorTexture.setShininess(10.0);
    this.doorTexture.loadTexture("textures/door.png");  // Assuming door texture exists
    this.doorTexture.setTextureWrap('REPEAT', 'REPEAT');
    this.door = new MyPlane(scene, 10);  // Create door object using MyPlane

    this.window = new MyWindow(scene, 1, 1, this.windowTexture);

}

  initModules() {
    // Central module width (40% of totalWidth)
    this.centralWidth = this.totalWidth * 0.4;
    // Side module width (75% of centralWidth)
    this.sideWidth = this.centralWidth * 0.75;
    // Depth of the building (same as side module width)
    this.depth = this.sideWidth;
    // Height of each floor
    this.floorHeight = 1.0;

    // Central module will have one more floor than the side modules
    this.centralFloors = this.numFloorsSide + 1;
  }

  display() {
    // Central Module (one more floor)
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0);
    this.displayModule(this.centralFloors, this.centralWidth, 0, true);  // Central module
    this.scene.popMatrix();

    // Left Module (side module width)
    this.scene.pushMatrix();
    this.scene.translate(-this.centralWidth * 0.875, 0, 0);  // Position left module
    this.displayModule(this.numFloorsSide, this.sideWidth, 0, false);  // Side module
    this.scene.popMatrix();

    // Right Module (side module width)
    this.scene.pushMatrix();
    this.scene.translate(this.centralWidth * 0.875, 0, 0);  // Position right module
    this.displayModule(this.numFloorsSide, this.sideWidth, 0, false);  // Side module
    this.scene.popMatrix();

        // --- Draw Door ---
    this.scene.pushMatrix();
    this.scene.translate(0, 0.4, 0.01);
    this.scene.scale(0.8, 0.8, 1);
    this.doorTexture.apply();  
    this.door.display();
    this.scene.popMatrix();

    // --- Draw Sign ---
    this.scene.pushMatrix();
    this.scene.translate(0, this.floorHeight*0.9, 0.01);
    this.scene.scale(1.5, 0.4, 1);
    this.signTexture.apply();  
    this.sign.display();
    this.scene.popMatrix();

}


  displayModule(floors, width, xOffset, center = false) {
    const height = floors * this.floorHeight;  // Total height of the module
    const depth = this.depth;  // Depth of the module (fixed for simplicity)

    // Front wall (normal positioning)
    this.scene.pushMatrix();
    this.scene.translate(xOffset, height / 2, 0);  // Position front wall at correct height and depth
    this.scene.scale(width, height, 1);  // Scale the wall to the correct dimensions
    this.wallMaterial.apply();  // Apply the wall material
    this.wall.display();  // Display the front wall
    this.scene.popMatrix();

    // Back wall (rotated 180 degrees to face the back)
    this.scene.pushMatrix();
    this.scene.translate(xOffset, height / 2, -depth);  // Position back wall at correct height and depth
    this.scene.rotate(Math.PI, 0, 1, 0);  // Rotate 180° to face the back
    this.scene.scale(width, height, 1);  // Scale the wall to the correct dimensions
    this.wallMaterial.apply();  // Apply the wall material
    this.wall.display();  // Display the back wall
    this.scene.popMatrix();

    // Right wall (rotated 90° for side wall)
    this.scene.pushMatrix();
    this.scene.translate(xOffset + width / 2, height / 2, -depth / 2);  // Position right wall at the correct location
    this.scene.rotate(Math.PI / 2, 0, 1, 0);  // Rotate 90° to face right side
    this.scene.scale(depth, height, 1);  // Scale the wall to the correct dimensions
    this.wallMaterial.apply();  // Apply the wall material
    this.wall.display();  // Display the right wall
    this.scene.popMatrix();

    // Left wall (rotated -90° for side wall)
    this.scene.pushMatrix();
    this.scene.translate(xOffset - width / 2, height / 2, -depth / 2);  // Position left wall at the correct location
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);  // Rotate -90° to face left side
    this.scene.scale(depth, height, 1);  // Scale the wall to the correct dimensions
    this.wallMaterial.apply();  // Apply the wall material
    this.wall.display();  // Display the left wall
    this.scene.popMatrix();


    // Special handling for central module: Extend side walls for center module
    if (center) {
        // Left side wall for central module extends further outside
        this.scene.pushMatrix();
        this.scene.translate(xOffset - width / 2 - 0.1, height / 2, -depth / 2);  // Extend left wall beyond the module
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);  // Rotate to the correct orientation
        this.scene.scale(depth, height, 1);  // Scale the wall
        this.wallMaterial.apply();  // Apply the wall material
        this.wall.display();  // Display the extended left wall
        this.scene.popMatrix();

        // Right side wall for central module extends further outside
        this.scene.pushMatrix();
        this.scene.translate(xOffset + width / 2 + 0.1, height / 2, -depth / 2);  // Extend right wall beyond the module
        this.scene.rotate(Math.PI / 2, 0, 1, 0);  // Rotate to the correct orientation
        this.scene.scale(depth, height, 1);  // Scale the wall
        this.wallMaterial.apply();  // Apply the wall material
        this.wall.display();  // Display the extended right wall
        this.scene.popMatrix();
    }
     // Roof (positioned on top of each module)
     this.scene.pushMatrix();
     this.scene.translate(xOffset, height, -depth/2);
     this.scene.rotate(-Math.PI / 2, 1, 0, 0);
     this.scene.scale(width, depth, 1);
     this.wallMaterial.apply();  // Apply the wall material to the roof
     this.roof.display();  // Display the roof
     this.scene.popMatrix();


     for (let floor = 0; floor < floors; floor++) {
        for (let i = 0; i < this.windowsperfloor; i++) {
            if (center && floor === 0) continue;
            const xPos = xOffset - width / 2 + (i + 1) * (width / (this.windowsperfloor + 1));
    
            // Adjust yPos based on whether it's the central module
            let yPos = (floor + 0.5) * this.floorHeight;  // Default calculation for yPos
            
            
    
            this.scene.pushMatrix();
            this.scene.translate(xPos, yPos, 0.01); 
            
            this.scene.scale(0.5, 0.5, 1);  // Scale the window to the desired size
    
            this.window.display();  
            this.scene.popMatrix();
        }
    }
    
    
    
  }

}
