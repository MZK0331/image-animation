import * as THREE from 'three/webgpu'
import gsap from 'gsap'
import { Fn, mix, texture, uniform, uv, vec4 } from 'three/tsl'

import { spSize } from '../../events/size-change'
import { Common } from '../core/common'


interface ImageMeshInitProps {
    width: number,
    height: number,
    uFilterTexture: THREE.Texture,
    uTexture: THREE.Texture,
    pcScale: number,
    pcStartPos: THREE.Vector3,
    pcEndPos: THREE.Vector3,
    spScale: number,
    spStartPos: THREE.Vector3,
    spEndPos: THREE.Vector3,
    animationTime: number,
    fadeInOpacityTimeSpent: number,
    fadeOutOpacityTimeSpent: number,
    imageTransitionStartTime: number,
    imageTransitionDuration: number,
    delay: number
}


export class ImageMesh {
    private common: Common
    private props: ImageMeshInitProps
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicNodeMaterial>


    private timeline = gsap.timeline()
    private positionProgress: number = 0
    private uniforms: {
        uFilterTexture: THREE.Texture,
        uTexture: THREE.Texture,
        uMixProgress: THREE.TSL.ShaderNodeObject<THREE.UniformNode<number>>,
        // uBlurStrength: uniform(1),
        uOpacity: THREE.TSL.ShaderNodeObject<THREE.UniformNode<number>>
    }

    constructor(common: Common, props: ImageMeshInitProps) {
        const geometry = new THREE.PlaneGeometry(props.width, props.height)
        const material = new THREE.MeshBasicNodeMaterial()
        
        this.mesh = new THREE.Mesh(geometry, material)        
        this.common = common
        this.props = props

        this.uniforms = {
        uFilterTexture: new THREE.Texture(),
        uTexture: new THREE.Texture(),
        uMixProgress: uniform(0),
        // uBlurStrength: uniform(1),
        uOpacity: uniform(1)
    }
        this.uniforms.uFilterTexture = props.uFilterTexture
        this.uniforms.uTexture = props.uTexture
        
        this.mesh.material.transparent = true
        this.mesh.material.colorNode = Fn(([ftTex, tex, mixP, opacity]: [THREE.Texture, THREE.Texture, number, number]) => {
            const ft = texture(ftTex, uv())
            const t = texture(tex, uv())
            const mixt = mix(ft, t, mixP).rgb
            return vec4(mixt, opacity)
        })(this.uniforms.uFilterTexture, this.uniforms.uTexture, this.uniforms.uMixProgress, this.uniforms.uOpacity)
    }
    
    public updatePosition = () => {
        const isSp = window.innerWidth < spSize
        const startPos = isSp ? this.props.spStartPos : this.props.pcStartPos
        const endPos = isSp ? this.props.spEndPos : this.props.pcEndPos
        const { viewWidth, viewHeight } = this.common

        const x = THREE.MathUtils.lerp(
            startPos.x,
            endPos.x,
            this.positionProgress
        ) * viewWidth

        const y = THREE.MathUtils.lerp(
            startPos.y,
            endPos.y,
            this.positionProgress
        ) * viewHeight

        const z = THREE.MathUtils.lerp(
            startPos.z,
            endPos.z,
            this.positionProgress
        ) * ((viewWidth + viewHeight) * 0.5)

        this.mesh.position.set(x, y, z)
    }

    public updateSize = () => {
        const isSp = window.innerWidth < spSize
        const scale = isSp ? this.props.spScale : this.props.pcScale

        const width = this.common.viewWidth * scale
        const scaleValue = width / this.mesh.geometry.parameters.width
        this.mesh.scale.set(scaleValue, scaleValue, 1)
    }
    
    public startLoopAnimation = () => {
        this.timeline.kill()


        this.uniforms.uOpacity.value = 0

        this.timeline = gsap.timeline({
            repeat: -1,
            repeatDelay: this.props.delay,
            delay: this.props.delay
        })

        this.timeline
            // step 1 ===================
            // フェードイン
            .to(this.uniforms.uOpacity, {
                value: 1,
                duration: this.props.fadeInOpacityTimeSpent,
                ease: "ease"
            }, 0)
            // アニメーション進行度
            .to(this, {
                positionProgress: 1,
                duration: this.props.animationTime,
                ease: "power2.out"
            }, 0)

            // step 2 画像切り替え ===================
            .to(this.uniforms.uMixProgress, {
                value: 1,
                duration: this.props.imageTransitionDuration,
                ease: "power2.in"
            }, this.props.imageTransitionStartTime)

            // step 3 ===================
            // フェードアウト
            .to(this.uniforms.uOpacity, {
                value: 0,
                duration: this.props.fadeOutOpacityTimeSpent,
                ease: "power2.in"
            }, this.props.animationTime - this.props.fadeOutOpacityTimeSpent)

    }
}