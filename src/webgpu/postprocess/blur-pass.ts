import * as THREE from 'three'
import { Common } from '../core/common'
import { add, div, float, Fn, mul, smoothstep, texture, uniform, uv, vec2, vec4 } from 'three/tsl'


export class BlurPass {
    private common: Common
    private _renderTarget: THREE.RenderTarget
    private renderTarget: THREE.RenderTarget
    private scene: THREE.Scene
    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    private uniforms = {
        near: uniform(0),
        far: uniform(0),
        px: uniform(new THREE.Vector2())
    }

    constructor(common: Common) {
        this.common = common
        this._renderTarget = new THREE.RenderTarget(common.width, common.height, {
            depthTexture: new THREE.DepthTexture(common.width, common.height),
            depthBuffer: true
        })
        this.renderTarget = new THREE.RenderTarget(common.width, common.height)
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
                this.uniforms.far, // 奥
                viewZ
            ).pow(1.5)

            // ブラー半径
            const radius = blurStrength.mul(0.5).mul(this.uniforms.px)

            // 簡易 9-tap ブラー
            const offsets = [
                vec2(-1, 0), vec2(1, 0),
                vec2(0, -1), vec2(0, 1),
                vec2(-1, -1), vec2(1, -1),
                vec2(-1, 1), vec2(1, 1)
            ]

            const w0 = 0.05
            const w1 = 0.09
            const w2 = 0.12
            const w3 = 0.15
            const w4 = 0.18

            const color = texture(this._renderTarget.texture, vUv).mul(w0)
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[0], radius))).mul(w1))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[1], radius))).mul(w2))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[2], radius))).mul(w3))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[3], radius))).mul(w4))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[4], radius))).mul(w4))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[5], radius))).mul(w3))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[6], radius))).mul(w2))
            color.addAssign(texture(this._renderTarget.texture, add(vUv, mul(offsets[7], radius))).mul(w1))

            return color
        })()
        
        return new THREE.Mesh(geometry, material)
    }

    render = async (_scene: THREE.Scene, _camera: THREE.PerspectiveCamera, out: boolean = true) => {
        let rt = null
        if (!out) rt = this.renderTarget 
        
        this.common.renderer.setRenderTarget(this._renderTarget)
        await this.common.renderer.renderAsync(_scene, _camera)

        this.uniforms.near.value = _camera.near
        this.uniforms.far.value = _camera.far
        this.uniforms.px.value.set(1 / this.common.width, 1 / this.common.height)

        this.common.renderer.setRenderTarget(rt)
        await this.common.renderer.renderAsync(this.scene, this.common.oCamera)

        return this._renderTarget
    }
}