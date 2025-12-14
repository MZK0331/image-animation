import * as THREE from 'three/webgpu'
import gsap from 'gsap'
import { add, Fn, mix, texture, uniform, uv, vec2, vec4 } from 'three/tsl'

import { spSize } from '../../events/size-change'


interface ImageMeshInitProps {
    width: number,
    height: number,
    uFilterTexture: THREE.Texture,
    uTexture: THREE.Texture,
    pcStartPos: THREE.Vector3,
    pcEndPos: THREE.Vector3,
    spStartPos: THREE.Vector3,
    spEndPos: THREE.Vector3,
    animationTime: number,
    fadeInOpacityTimeSpent: number,
    fadeOutOpacityTimeSpent: number,
    delay: number
}

export class ImageMesh extends THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
    private pcStartPos: THREE.Vector3
    private pcEndPos: THREE.Vector3
    private spStartPos: THREE.Vector3
    private spEndPos: THREE.Vector3
    private animationTime: number
    private fadeInOpacityTimeSpent: number
    private fadeOutOpacityTimeSpent: number
    private delay: number

    private timeline = gsap.timeline()
    private animationProgress: number = 0
    private uniforms = {
        uFilterTexture: new THREE.Texture(),
        uTexture: new THREE.Texture(),
        uMixProgress: uniform(0),
        // uBlurStrength: uniform(1),
        uOpacity: uniform(1)
    }

    constructor(props: ImageMeshInitProps) {
        const geometry = new THREE.PlaneGeometry(props.width, props.height)
        const material = new THREE.MeshBasicMaterial()
        
        super(geometry, material)

        this.pcStartPos = props.pcStartPos
        this.pcEndPos = props.pcEndPos
        this.spStartPos = props.spStartPos
        this.spEndPos = props.spEndPos
        this.animationTime = props.animationTime
        this.fadeInOpacityTimeSpent = props.fadeInOpacityTimeSpent
        this.fadeOutOpacityTimeSpent = props.fadeOutOpacityTimeSpent
        this.delay = props.delay

        this.uniforms.uFilterTexture = props.uFilterTexture
        this.uniforms.uTexture = props.uTexture
        
        this.material.transparent = true
        this.material.colorNode = Fn(() => {
            const ft = texture(this.uniforms.uFilterTexture, uv())
            const t = texture(this.uniforms.uTexture, uv())
            
            const mixt = mix(ft, t, this.uniforms.uMixProgress).rgb

            // const color = gaussianBlur()

            return vec4(mixt, this.uniforms.uOpacity)
        })()
    }
    
    public startLoopAnimation = () => {
        this.timeline.kill()

        const isSp = window.innerWidth < spSize
        const startPos = isSp ? this.spStartPos : this.pcStartPos
        const endPos = isSp ? this.spEndPos : this.pcEndPos

        this.position.copy(startPos)
        this.uniforms.uOpacity.value = 0

        this.timeline = gsap.timeline({
            repeat: -1,
            repeatDelay: this.delay,
            onRepeat: () => {
                this.position.copy(startPos)
            }
        })

        this.timeline
            // step 1 ===================
            // フェードイン
            .to(this.uniforms.uOpacity, {
                value: 1,
                duration: this.fadeInOpacityTimeSpent,
                ease: "power2.out"
            }, 0)
            // 位置移動
            .to(this.position, {
                x: endPos.x,
                y: endPos.y,
                z: endPos.z,
                duration: this.animationTime,
                ease: "power1.inOut" 
            }, 0)
            // アニメーション進行度
            .to(this, {
                animationProgress: 1,
                duration: this.animationTime,
                ease: "power1.inOut"
            }, 0)
            // step 2 ===================
            // フェードアウト
            .to(this.uniforms.uOpacity, {
                value: 0,
                duration: this.fadeOutOpacityTimeSpent,
                ease: "power2.in"
            }, this.animationTime - this.fadeOutOpacityTimeSpent)

    }
}



// const gaussianBlur = (
//     tex: THREE.Texture,
//     blurStrength: THREE.TSL.ShaderNodeObject<THREE.UniformNode<number>> // 0.0 ~ 1.0
// ) => {

//     const texel = blurStrength.mul(0.002)

//     let color = texture(tex, uv()).mul(0.227027)

//     color = add(color,
//         texture(tex, uv().add(vec2(texel, 0))).mul(0.316216)
//     )
//     color = add(color,
//         texture(tex, uv().sub(vec2(texel, 0))).mul(0.316216)
//     )

//     color = add(color,
//         texture(tex, uv().add(vec2(0, texel))).mul(0.070270)
//     )
//     color = add(color,
//         texture(tex, uv().sub(vec2(0, texel))).mul(0.070270)
//     )

//     return color
// }