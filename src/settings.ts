import * as THREE from 'three/webgpu'
import GUI from 'lil-gui'

import { ImageMeshProps } from "./webgpu/top/image-mesh-controller"

export const gui = new GUI()

export const imageBaseSize = 20
export const imageMeshStartAnimationDelays = [0]
export const imageMeshes: ImageMeshProps[] = [
    {
        imgSrc: '/top/img1.jpeg',
        width: 1210,
        height: 2048,
        pcStartPos: new THREE.Vector3(6, 0, -10),
        pcEndPos: new THREE.Vector3(1, 0, 8),
        spStartPos: new THREE.Vector3(0, 0, 50),
        spEndPos: new THREE.Vector3(0, 0, 0),
        animationTime: 5,
        fadeInOpacityTimeSpent: 0.3,
        fadeOutOpacityTimeSpent: 0.3,
        delay: 3
    },
]