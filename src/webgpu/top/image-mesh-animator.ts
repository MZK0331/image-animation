import { Common } from "../core/common";
import { ImageMeshController } from "./image-mesh-controller";
import { imageMeshStartAnimationDelays } from '../../settings';


export class ImageMeshAnimator {
    private common: Common
    private meshController: ImageMeshController
    private isAnimating: boolean

    constructor(common: Common) {
        this.common = common
        this.meshController = new ImageMeshController(common)
        this.isAnimating = false
    }

    public startAnimation = async () => {
        if (this.isAnimating) return
        this.isAnimating = true

        this.meshController.meshes.forEach(mesh => {
            this.common.scene.add(mesh.mesh)
        })

        let index = 0
        this.meshController.meshes.forEach(mesh => {
            const delay = imageMeshStartAnimationDelays[index]

            setTimeout(() => {
                mesh.startLoopAnimation()
            }, delay)
            
            index++
        })
    }

    public update = () => {
        this.meshController.update()
    }
    
    public onResize = () => {
        this.meshController.onResize()
    }
}