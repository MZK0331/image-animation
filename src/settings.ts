// import GUI from 'lil-gui'

import { ImageMeshProps } from "./webgpu/top/image-mesh-controller"

// export const gui = new GUI()

export const imageMeshStartAnimationDelays = [0]
export const imageMeshFilterTexturePath = '/textures/gra1.png'
// x, y: -0.5 ~0.5 (z = 0 において)
export const imageMeshes: ImageMeshProps[] = [
    {
        imgSrc: '/top/img1.jpeg',
        width: 1210,
        height: 2048,
        pcScale: 0.1,
        pcStartPos: { x: 0.1, y: 0, z: -0.5 },
        pcEndPos:   { x: 0.17, y: 0, z: 0.25 },
        spScale: 0.2,
        spStartPos: { x: 0, y: 0.0, z: 1 },
        spEndPos:   { x: 0.1, y: 0.0, z: 0 },
        animationTime: 5,
        fadeInOpacityTimeSpent: 2,
        fadeOutOpacityTimeSpent: 0.7,
        imageTransitionStartTime: 0.5,
        imageTransitionDuration: 1,
        delay: 3
    },
    {
        imgSrc: '/top/img2.jpeg',
        width: 1210,
        height: 2048,
        pcScale: 0.1,
        pcStartPos: { x: -0.1, y: 0, z: -0.5 },
        pcEndPos:   { x: -0.17, y: 0, z: 0.25 },
        spScale: 0.2,
        spStartPos: { x: 0, y: 0.0, z: 1 },
        spEndPos:   { x: 0.1, y: 0.0, z: 0 },
        animationTime: 5,
        fadeInOpacityTimeSpent: 2,
        fadeOutOpacityTimeSpent: 0.7,
        imageTransitionStartTime: 0.5,
        imageTransitionDuration: 1,
        delay: 5
    },
]