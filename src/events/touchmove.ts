type TouchMoveListener = (event: TouchEvent) => void

const TouchMoveListener = new Set<TouchMoveListener>()


window.addEventListener('touchmove', (event) => {
    TouchMoveListener.forEach((listener) => {
        listener(event)
    })
})
export const subscribeTouchMoveListener = (listener: TouchMoveListener) => TouchMoveListener.add(listener)
export const unsubscribeTouchMoveListener = (listener: TouchMoveListener) => TouchMoveListener.delete(listener)