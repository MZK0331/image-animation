import * as THREE from 'three'

import { imageMeshes } from "../../settings";
import { Common } from "../core/common";
import { ImageMesh } from "../parts/image-mesh";


export interface ImageMeshProps {
    imgSrc: string,
    width: number,
    height: number,
    pcStartPos: THREE.Vector3,
    pcEndPos: THREE.Vector3,
    spStartPos: THREE.Vector3,
    spEndPos: THREE.Vector3,
    animationTime: number
    fadeInOpacityTimeSpent: number,
    fadeOutOpacityTimeSpent: number,
    delay: number
}

export class ImageMeshController {
    private common: Common
    public meshes: Set<ImageMesh>

    constructor(common: Common) {
        this.common = common
        this.meshes = new Set()

        const filterTexture = this.common.textureLoader.load('/textures/gra1.png')
        imageMeshes.forEach(obj => {
            let width: number, height: number

            if (obj.width < obj.height) {
                width = 1
                height = Math.floor(obj.height / obj.width * 100) / 100
            } else {
                width = Math.floor(obj.width / obj.height * 100) / 100
                height = 1
            }

            const texture = this.common.textureLoader.load(obj.imgSrc)
            
            const mesh = new ImageMesh({ ...obj, 
                width,
                height,
                uFilterTexture: filterTexture,
                uTexture: texture,
            })
            
           this.meshes.add(mesh)
        })
    }

    public onResize = () => {

    }
}