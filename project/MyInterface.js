import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();
        
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'displayPlane').name('Display Plane');
        this.gui.add(this.scene, 'displayGlobe').name('Display Globe');
        this.gui.add(this.scene, 'displayPanorama').name('Display Panorama');
        this.gui.add(this.scene, 'displayBuilding').name("Display Building");
        this.gui.add(this.scene, 'numFloorsSide', 1, 7, 1).name('Floors').onChange(() => this.scene.updateBuilding());
        this.gui.add(this.scene, 'windowsPerFloor', 2, 7, 1).name('Windows').onChange(() => this.scene.updateBuilding());
        this.gui.add(this.scene, 'displayForest').name("Display Forest");
        this.gui.add(this.scene, 'forestRows', 1, 10, 1).name('Forest Rows').onChange(() => this.scene.updateForest());
        this.gui.add(this.scene, 'forestCols', 1, 10, 1).name('Forest Columns').onChange(() => this.scene.updateForest());
        this.gui.add(this.scene, 'forestSpacing', 3, 5.5, 0.1).name('Forest Spacing').onChange(() => this.scene.updateForest());
        this.gui.add(this.scene, 'displayHeli').name("Display Helicopter");
        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor');
        this.gui.add(this.scene, 'cruiseAltitude', 10, 50, 1).name("Cruise Altitude").onChange(value => {this.scene.heli.setCruiseAltitude(value);});
        this.gui.add(this.scene, 'displayFire').name('Display Fire');
        this.gui.add(this.scene, 'realisticFire').name('Realistic Fire');
        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}