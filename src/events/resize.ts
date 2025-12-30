type ResizeListener = () => void

const resizeListener = new Set<ResizeListener>()

export const updateResizeListeners = () => {
    resizeListener.forEach((listener) => {
        listener()
    })
}

const observer = new ResizeObserver(updateResizeListeners)

observer.observe(document.body)

export const subscribeResizeListener = (listener: ResizeListener) => resizeListener.add(listener)
export const unsubscribeResizeListener = (listener: ResizeListener) => resizeListener.delete(listener)