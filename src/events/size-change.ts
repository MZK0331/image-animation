export const spSize = 768

type SizeSPListener = () => void
type SizePCListener = () => void

const sizeSPListeners = new Set<SizeSPListener>()
const sizePCListeners = new Set<SizePCListener>()

const mediaQuery = window.matchMedia(`(max-width: ${spSize}px)`)

const handleSizeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
        sizeSPListeners.forEach(listener => listener())
    } else {
        sizePCListeners.forEach(listener => listener())
    }
}

mediaQuery.addEventListener('change', handleSizeChange)


export const subscribeSizeSPListener = (listener: SizeSPListener) => sizeSPListeners.add(listener)
export const unsubscribeSizeSPListener = (listener: SizeSPListener) => sizeSPListeners.delete(listener)

export const subscribeSizePCListener = (listener: SizePCListener) => sizePCListeners.add(listener)
export const unsubscribeSizePCListener = (listener: SizePCListener) => sizePCListeners.delete(listener)