import { subscribeMouseMoveListener } from "../../events/mousemove"
import { subscribeResizeListener } from "../../events/resize"
import { subscribeTouchMoveListener } from "../../events/touchmove"

export class Basic {
    constructor() {
        subscribeResizeListener(this.onResize.bind(this))
        subscribeMouseMoveListener(this.onMouseMove.bind(this))
        subscribeTouchMoveListener(this.onTouchMove.bind(this))
    }

    public startRendering() {
        this.tick()
    }
    
    private async tick() {
        window.requestAnimationFrame(this.tick.bind(this))

        this.update()
        await this.render()
    }
    
    protected update() {

    }

    protected async render() {

    }

    protected onResize() {

    }

    protected onMouseMove(e: MouseEvent) {

    }

    protected onTouchMove(e: TouchEvent) {

    }
}