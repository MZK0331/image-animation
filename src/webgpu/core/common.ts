import * as THREE from 'three/webgpu'
import { Textures } from './textures'
import { Mouse } from './mouse'


export class Common {
    public width: number
    public height: number
    public aspect: number
    public pCamera: THREE.PerspectiveCamera
    public oCamera: THREE.OrthographicCamera
    public viewWidth: number
    public viewHeight: number
    public renderer: THREE.WebGPURenderer
    public scene: THREE.Scene
    public clock: THREE.Clock
    public mouse: Mouse
    public textures: Textures
    public textureLoader: THREE.TextureLoader
    
    constructor(canvas: HTMLCanvasElement) {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspect = this.width / this.height
        this.pCamera = new THREE.PerspectiveCamera(
            75, this.aspect, 0.1, 100
        )
        this.oCamera = new THREE.OrthographicCamera(
            -1, 1, 1, -1, 0.1, 2
        )
        const viewSize = this.getViewSize(this.pCamera, 0)
        this.viewWidth = viewSize.viewWidth
        this.viewHeight = viewSize.viewHeight
        this.renderer = new THREE.WebGPURenderer({
            canvas: canvas,
            antialias: window.devicePixelRatio === 1.0,
            alpha: true
        })
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.mouse = new Mouse()
        this.textures = new Textures()
        this.textureLoader = new THREE.TextureLoader()

        this.setRenderer()
        this.setCamera()
    }

    private async setRenderer() {
        this.renderer.autoClearColor = true
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x000000, 0)
        await this.renderer.init()
    }

    private setCamera() {
        const zeroVector = new THREE.Vector3(0, 0, 0)

        this.pCamera.position.set(0, 0, 10)
        this.pCamera.lookAt(zeroVector)
        
        this.oCamera.position.set(0, 0, 1)
        this.oCamera.lookAt(zeroVector)
    }

    public getViewSize(camera: THREE.PerspectiveCamera, z=this.pCamera.position.z) {
        const vFov = THREE.MathUtils.degToRad(camera.fov)
        const _viewHeight = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z - z)
        const _viewWidth = _viewHeight * camera.aspect

        const viewWidth = Math.floor(_viewWidth * 10000) / 10000
        const viewHeight = Math.floor(_viewHeight * 10000) / 10000

        return { viewWidth, viewHeight }
    }

    onResize(): void {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspect = this.width / this.height;

        this.pCamera.aspect = this.aspect
        this.pCamera.updateProjectionMatrix()

        this.renderer.setSize(this.width, this.height);
        const viewSize = this.getViewSize(this.pCamera, 0)
        this.viewWidth = viewSize.viewWidth
        this.viewHeight = viewSize.viewHeight
    }

    update() {
        this.mouse.update()
    }

    onMouseMove(e: MouseEvent): void {
        this.mouse.onMouseMove(e)
    }
}