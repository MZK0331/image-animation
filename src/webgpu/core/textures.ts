import * as THREE from "three/webgpu";

export class Textures {
    private textures: { [key: string]: THREE.Texture } = {}
    
    constructor() {
        this.textures = {}
    }

    get(key: string): THREE.Texture {
        const texture = this.textures[key]
        if (!texture) throw new Error(`Texture not found: ${key}`)
        return texture
    }

    update(key: string, texture: THREE.Texture): void {
        this.textures[key] = texture
    }
}