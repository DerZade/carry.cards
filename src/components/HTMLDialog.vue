<template>
  <Transition :css="false" appear @leave="onLeave" @afterEnter="onAfterEnter">
    <dialog
      v-if="visible"
      v-bind="attrs"
      @close="
        (e) => {
          visible = false
          emit('close', e)
        }
      "
    >
      <slot />
    </dialog>
  </Transition>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

/**
 * Indicates if dialog is visible
 */
const visible = defineModel<boolean>('visible', { type: Boolean, required: true })

/* eslint-disable @typescript-eslint/no-explicit-any */
defineSlots<{
  /**
   * Content of dialog
   */
  default(): any
}>()
/* eslint-enable @typescript-eslint/no-explicit-any */

const { modal = true } = defineProps<{
  /**
   * If set dialog opens as modal (see {@link HTMLDialogElement.showModal} compared to {@link HTMLDialogElement.show})
   *
   * @default  true
   */
  modal?: boolean
}>()

const emit = defineEmits<{
  close: [Event]
}>()

const attrs = useAttrs()

function onAfterEnter(el: Element) {
  if (!(el instanceof HTMLDialogElement)) return

  if (modal) el.showModal()
  else el.show()
}

function onLeave(el: Element, done: () => void) {
  if (!(el instanceof HTMLDialogElement)) return

  el.addEventListener('transitionend', () => done(), { once: true })
  el.close()
}
</script>

<script lang="ts">
/**
 * This is wrapper around the native dialog element.
 * It provides a way to control the dialog element using Vue's reactivity system while allowing for open / close transitions.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
export default {}
</script>
