import { subscribeResizeListener, updateResizeListeners } from "./events/resize"
import { updateScrollbarSizeVar } from "./ui/scrollbar"
import { TopWebGPUController } from "./webgpu/top/controller"

const setHamburgerListener = () => {
  const hamburger = document.getElementById('hamburger')
  const window = document.getElementById('window')
  const main  = document.getElementById('main')
  if (!window || !main) return
  let isOpen = false

  hamburger?.addEventListener('click', () => {
    if (!isOpen) {
      document.body.style.overflowY = 'hidden'
      updateResizeListeners()
      isOpen = true
    } else {
      document.body.style.overflowY = 'auto'
      updateResizeListeners()
      isOpen = false
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement
  if (!canvas) return

  subscribeResizeListener(updateScrollbarSizeVar)

  const webgpuController = new TopWebGPUController(canvas)
  webgpuController.startRendering()
  webgpuController.startImageMeshAnimation()

  
  setHamburgerListener()
})