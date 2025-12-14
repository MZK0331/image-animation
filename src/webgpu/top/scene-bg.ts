import * as THREE from 'three'

import { Common } from "../core/common";


export class SceneBackground {
    private common: Common
    
    constructor(common: Common) {
        this.common = common
        this.common.scene.background = this.createSceneTexture()
    } 

    private createSceneTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 512;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#1e3c72');
        grad.addColorStop(1, '#2a5298');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        return new THREE.CanvasTexture(canvas);
    }
}