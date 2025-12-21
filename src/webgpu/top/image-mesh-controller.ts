import * as THREE from "three/webgpu";

import { imageMeshes, imageMeshFilterTexturePath } from "../../settings";
import { Common } from "../core/common";
import { ImageMesh } from "../parts/image-mesh";


type Vec3 = { x: number, y: number, z: number }
export interface ImageMeshProps {
    imgSrc: string,
    width: number,
    height: number,
    pcScale: number,
    spScale: number,
    pcStartPos: Vec3,
    pcEndPos: Vec3,
    spStartPos: Vec3,
    spEndPos: Vec3,
    animationTime: number
    fadeInOpacityTimeSpent: number,
    fadeOutOpacityTimeSpent: number,
    imageTransitionStartTime: number,
    imageTransitionDuration: number,
    delay: number
}

export class ImageMeshController {
    private common: Common
    private props: ImageMeshProps[]
    public meshes: ImageMesh[]

    constructor(common: Common) {
        this.common = common
        this.props = imageMeshes
        this.meshes = []

        const filterTexture = this.common.textureLoader.load(imageMeshFilterTexturePath)
        imageMeshes.forEach(obj => {

            const width = 1
            const height = Math.floor(obj.height / obj.width * 100) / 100

            const texture = this.common.textureLoader.load(obj.imgSrc)
            
            const mesh = new ImageMesh(common, { ...obj, 
                width,
                height,
                pcStartPos: new THREE.Vector3(obj.pcStartPos.x, obj.pcStartPos.y, obj.pcStartPos.z),
                pcEndPos: new THREE.Vector3(obj.pcEndPos.x, obj.pcEndPos.y, obj.pcEndPos.z),
                spStartPos: new THREE.Vector3(obj.spStartPos.x, obj.spStartPos.y, obj.spStartPos.z),
                spEndPos: new THREE.Vector3(obj.spEndPos.x, obj.spEndPos.y, obj.spEndPos.z),
                uFilterTexture: filterTexture,
                uTexture: texture,
            })
            
           this.meshes.push(mesh)
        })
    }

    public update = () => {
        this.meshes.forEach((mesh) => {
            mesh.updatePosition()
        })
    }
    
    public onResize = () => {
        this.meshes.forEach((mesh) => {
            mesh.updateSize()
        })
    }
}