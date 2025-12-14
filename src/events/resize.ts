type ResizeListener = () => void

const resizeListener = new Set<ResizeListener>()

const observer = new ResizeObserver(() => {
    resizeListener.forEach((listener) => {
        listener()
    })
})

observer.observe(document.body)

export const subscribeResizeListener = (listener: ResizeListener) => resizeListener.add(listener) 
export const unsubscribeResizeListener = (listener: ResizeListener) => resizeListener.delete(listener)