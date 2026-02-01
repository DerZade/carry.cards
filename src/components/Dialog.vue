<template>
  <Transition :css="false" appear @leave="onLeave" @afterEnter="onAfterEnter">
    <dialog
      v-if="visible"
      v-bind="attrs"
      class="rounded-2xl p-6 max-is-[90dvi] is-lg backdrop:bg-background/50 m-auto grid gap-4"
      @close="
        (e) => {
          visible = false
          emit('close', e)
        }
      "
    >
      <h2 v-if="heading" class="text-xl font-semibold">
        {{ heading }}
      </h2>
      <slot />
    </dialog>
  </Transition>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

const visible = defineModel<boolean>('visible', { required: true })

const { heading, modal = true } = defineProps<{
  /**
   * Heading text for the dialog
   */
  heading?: string
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

defineSlots<{
  default: []
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

<style scoped>
dialog {
  transition:
    opacity 200ms,
    scale 200ms,
    display 200ms allow-discrete;
}

dialog::backdrop {
  transition:
    opacity 200ms,
    display 200ms allow-discrete;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    scale: 0.95;
  }

  dialog[open]::backdrop {
    opacity: 0;
  }
}

dialog:not([open]) {
  opacity: 0;
  scale: 0.95;
}

dialog:not([open])::backdrop {
  opacity: 0;
}
</style>
