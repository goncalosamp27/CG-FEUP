import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyPyramid extends CGFobject {
    constructor(scene, slices, stacks, height = 1, radius = 1) {
    /**

     * @param {CGFscene} scene  
     * @param {number} slices    - número de faces laterais 
     * @param {number} stacks    - nao usado
     * @param {number} height    - altura da pirâmide
     * @param {number} radius    - raio da base
     */
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let ang = 0;
        const alphaAng = 2 * Math.PI / this.slices;
        // faces laterais
        for (let i = 0; i < this.slices; i++) {
            const sa = Math.sin(ang);
            const ca = Math.cos(ang);
            const saa = Math.sin(ang + alphaAng);
            const caa = Math.cos(ang + alphaAng);

            this.vertices.push(0, this.height, 0); 
            this.vertices.push(ca * this.radius, 0, -sa * this.radius); 
            this.vertices.push(caa * this.radius, 0, -saa * this.radius); 

            const normal = [
                saa - sa,
                ca * saa - sa * caa,
                caa - ca
            ];
            const nsize = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
            normal[0] /= nsize; normal[1] /= nsize; normal[2] /= nsize;
            this.normals.push(...normal, ...normal, ...normal);
            const uStart = 0.0;
            const uEnd = 0.5;
            const vStart = 0.5;
            const vEnd = 1.0;

            this.texCoords.push((uStart + uEnd) / 2, vStart); // topo da pirâmide (centro da parte de cima da célula)
            this.texCoords.push(uStart, vEnd);               // base esquerda (canto inferior esquerdo da célula)
            this.texCoords.push(uEnd, vEnd);                 // base direita (canto inferior direito da célula)


            this.indices.push(3 * i, 3 * i + 1, 3 * i + 2);

            ang += alphaAng;
        }
        // --- Base poligonal ---
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);              
        this.normals.push(0, -1, 0);              
        this.texCoords.push(0.5, 0.5); 
        ang = 0;
        
        for (let i = 0; i < this.slices; i++) {
            const sa = Math.sin(ang);
            const ca = Math.cos(ang);

            // posição no perímetro da base
            this.vertices.push(ca * this.radius, 0, -sa * this.radius);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + 0.5 * ca, 0.5 + 0.5 * sa);

            // forma o triângulo (centro, próximo, atual) para fechar a base
            const idx0 = baseCenterIndex;
            const idx1 = baseCenterIndex + 1 + i;
            const idx2 = baseCenterIndex + 1 + ((i + 1) % this.slices);
            this.indices.push(idx0, idx2, idx1);

            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); 

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


