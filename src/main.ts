import { TopWebGPUController } from "./webgpu/top/controller"


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement
  if (!canvas) return

  const webgpuController = new TopWebGPUController(canvas)
  webgpuController.startRendering()
  webgpuController.startImageMeshAnimation()
})