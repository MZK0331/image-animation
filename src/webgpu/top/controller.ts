import Stats from 'three/examples/jsm/libs/stats.module.js'

import { Basic } from "../core/basic";
import { Common } from "../core/common";
import { ImageMeshAnimator } from "./image-mesh-animator";
import { SceneBackground } from "./scene-bg";
import { BlurPass } from '../postprocess/blur-pass';
import { KawaseBlurPass } from '../postprocess/kawase-blur-pass';


export class TopWebGPUController extends Basic {
    private eventFunctions: Set<() => void>
    private stats = new Stats()
    public common: Common
    private sceneBg: SceneBackground
    private imageMeshAnimator: ImageMeshAnimator
    private blurPass: BlurPass
    private kawaseBlurPass: KawaseBlurPass
    
    constructor(canvas: HTMLCanvasElement) {
        super()

        this.eventFunctions = new Set()
        this.common = new Common(canvas)
        this.sceneBg = new SceneBackground(this.common)
        this.imageMeshAnimator = new ImageMeshAnimator(this.common)
        this.blurPass = new BlurPass(this.common)
        this.kawaseBlurPass = new KawaseBlurPass(this.common)

        document.body.appendChild(this.stats.dom)
    }
    
    public startImageMeshAnimation = () => {
        this.eventFunctions.add(this.imageMeshAnimator.startAnimation)
    }
    
    protected async render() {
        // await this.common.renderer.renderAsync(this.common.scene, this.common.pCamera)
        // await this.blurPass.render(this.common.scene, this.common.pCamera)
        await this.kawaseBlurPass.render(this.common.scene, this.common.pCamera)
    }

    protected update() {
        this.stats.update()
        this.eventFunctions.forEach(func => func())
        this.common.update()
        this.imageMeshAnimator.update()
        this.eventFunctions.clear()
    }
    
    protected onResize() {
        this.common.onResize()
        this.imageMeshAnimator.onResize()
    }

    protected onMouseMove(e: MouseEvent) {
        this.common.onMouseMove(e)
    }
}