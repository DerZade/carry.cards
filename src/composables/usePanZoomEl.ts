import {
  computed,
  shallowRef,
  toValue,
  triggerRef,
  unref,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type StyleValue,
} from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import Gesto from 'gesto'

export function usePanZoomEl(
  el: Ref<HTMLElement | null>,
  imageEl?: MaybeRefOrGetter<HTMLElement | SVGElement | null>,
): { style: Readonly<Ref<StyleValue>>; reset: () => void } {
  const matrix = shallowRef(new DOMMatrix())

  let gestoInstance: Gesto | null = null
  tryOnUnmounted(() => gestoInstance?.unset())

  watch(el, (val) => {
    function getPosRelToImg(e: { clientX: number; clientY: number }) {
      const zoomFactor = matrix.value.a
      const { left, top } = (toValue(imageEl) ?? unref(el))?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
      }

      return {
        x: (e.clientX - left) / zoomFactor,
        y: (e.clientY - top) / zoomFactor,
      }
    }

    gestoInstance?.unset()

    if (val === null) return

    const inst = new Gesto(val, {
      container: window,
      pinchOutside: true,
      pinchThreshold: Number.POSITIVE_INFINITY,
    })

    inst.on('drag', (e) => {
      const zoomFactor = matrix.value.a

      matrix.value.translateSelf(e.deltaX / zoomFactor, e.deltaY / zoomFactor)
      triggerRef(matrix)
    })

    inst.on('pinchStart', (e) => {
      const startScale = matrix.value.a
      const { x, y } = getPosRelToImg(e)

      inst.on('pinch', (e) => {
        const targetScale = startScale * e.scale
        const currentScale = matrix.value.a

        const factor = targetScale / currentScale

        matrix.value.scaleSelf(factor, factor, 1, x, y, 0)
        triggerRef(matrix)
      })

      inst.once('pinchEnd', () => inst.off('pinch'))
    })

    val.addEventListener('wheel', (e: WheelEvent) => {
      const factor = 1 + e.deltaY * -0.001

      const { x, y } = getPosRelToImg(e)

      matrix.value.scaleSelf(factor, factor, 1, x, y, 0)
      triggerRef(matrix)
    })

    gestoInstance = inst
  })

  return {
    style: computed(() => ({
      transform: matrix.value.toString(),
    })),
    reset: () => {
      matrix.value = new DOMMatrix()
    },
  }
}
