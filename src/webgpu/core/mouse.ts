import * as THREE from 'three/webgpu'


export class Mouse {
    public screen: THREE.Vector2
    public coords: THREE.Vector2
    public oldCoords: THREE.Vector2
    public diff: THREE.Vector2

    constructor() {
        this.screen = new THREE.Vector2()
        this.coords = new THREE.Vector2()
        this.oldCoords = new THREE.Vector2()
        this.diff = new THREE.Vector2()
    }

    private setCoords(e: MouseEvent | Touch) {
        this.coords.set(
            e.clientX / window.innerWidth * 2 - 1,
            - e.clientY / window.innerHeight * 2 + 1
        )
    }

    update(): void {
        this.diff.subVectors(this.coords, this.oldCoords)
        this.oldCoords.copy(this.coords)
    }

    onMouseMove(e: MouseEvent): void {
        this.setCoords(e)
    }

    onTouchMove(e: TouchEvent): void {
        this.setCoords(e.touches[0])
    }
}