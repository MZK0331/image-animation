type MouseMoveListener = (event: MouseEvent) => void

const mouseMoveListener = new Set<MouseMoveListener>()


window.addEventListener('mousemove', (event) => {
    mouseMoveListener.forEach((listener) => {
        listener(event)
    })
})
export const subscribeMouseMoveListener = (listener: MouseMoveListener) => mouseMoveListener.add(listener)
export const unsubscribeMouseMoveListener = (listener: MouseMoveListener) => mouseMoveListener.delete(listener)