import * as THREE from 'three/webgpu'
import { Common } from '../core/common'
import { add, div, float, Fn, mul, smoothstep, texture, uniform, uv, vec2, vec4 } from 'three/tsl'


export class KawaseBlurPass {
    private common: Common
    private pass = [1, 2, 4, 8, 12]
    private _renderTarget: THREE.RenderTarget
    private renderTargets: THREE.RenderTarget[]
    private scene: THREE.Scene
    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    private uniforms = {
        near: uniform(0),
        far: uniform(0),
        px: uniform(new THREE.Vector2()),
        radius: uniform(1),
        texture: uniform(new THREE.Texture())
    }

    constructor(common: Common) {
        this.common = common
        this._renderTarget = new THREE.RenderTarget(common.width, common.height, {
            depthTexture: new THREE.DepthTexture(common.width, common.height),
            depthBuffer: true
        })
        this.renderTargets = this.pass.map(() => new THREE.RenderTarget(common.width, common.height))

        this.scene = new THREE.Scene()

        this.mesh = this.createMesh()
        this.scene.add(this.mesh)
    }

    private createMesh = () => {
        if (!this._renderTarget.depthTexture) throw new Error('Depth Texture not supported')

        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.MeshBasicMaterial()
        material.colorNode = Fn(() => {
            const vUv = vec2(uv().x, float(1).sub(uv().y))

            // 深度取得（0〜1, 非線形）
            const depthTexture = this._renderTarget.depthTexture as THREE.Texture
            const depth = texture(depthTexture, vUv).x

            const z = depth.mul(2).sub(1) // [0,1] → [-1,1]
            const viewZ = div(
                mul(2.0, this.uniforms.near, this.uniforms.far),
                add(this.uniforms.far.add(this.uniforms.near), mul(z, this.uniforms.near.sub(this.uniforms.far)))
            )

            // 深度 → ブラー量
            const blurStrength = smoothstep(
                this.uniforms.near, // 手前
                // this.uniforms.far, // 奥
                20,
                viewZ
            ).mul(0.1)

            // ブラー半径
            const o = blurStrength.mul(this.uniforms.px).mul(this.uniforms.radius)

            const color = texture(this._renderTarget.texture, vUv)
            color.addAssign(texture(this._renderTarget.texture, vUv.add(o)))
            color.addAssign(texture(this._renderTarget.texture, vUv.add(o.mul(vec2(-1, 1)))))
            color.addAssign(texture(this._renderTarget.texture, vUv.add(o.mul(vec2(1, -1)))))
            color.addAssign(texture(this._renderTarget.texture, vUv.add(o.mul(vec2(-1, -1)))))
            
            return color.mulAssign(0.2)
        })()
        
        return new THREE.Mesh(geometry, material)
    }

    render = async (_scene: THREE.Scene, _camera: THREE.PerspectiveCamera, out: boolean = true) => {
        let rt = null
        if (!out) rt = this.renderTargets[this.pass.length - 1]
        
        this.common.renderer.setRenderTarget(this._renderTarget)
        await this.common.renderer.renderAsync(_scene, _camera)

        this.uniforms.near.value = _camera.near
        this.uniforms.far.value = _camera.far
        this.uniforms.px.value.set(1 / this.common.width, 1 / this.common.height)
        this.uniforms.texture.value = this._renderTarget.texture

        for (let i = 0; i < this.pass.length; i++) {
            this.uniforms.radius.value = this.pass[i]

            this.common.renderer.setRenderTarget(this.renderTargets[i])
            if (i === this.pass.length - 1) {
                this.common.renderer.setRenderTarget(rt)
            }
            await this.common.renderer.renderAsync(this.scene, this.common.oCamera)

            this.uniforms.texture.value = this.renderTargets[i].texture
        }

        return rt
    }
}