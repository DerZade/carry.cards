<template>
  <HTMLDialog
    v-model:visible="visible"
    :modal
    class="rounded-2xl p-6 max-is-[90dvi] is-lg backdrop:bg-background/50 bg-surface m-auto grid gap-4"
    @close="(e) => emit('close', e)"
  >
    <h2 v-if="heading" class="text-xl font-semibold">
      {{ heading }}
    </h2>
    <slot />
  </HTMLDialog>
</template>

<script setup lang="ts">
import HTMLDialog from './HTMLDialog.vue'

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
</script>

<style scoped>
/* 1. Closed State */
dialog {
  opacity: 0;
  scale: 0.95;
  transition:
    opacity 200ms ease,
    scale 200ms ease,
    display 200ms ease allow-discrete,
    overlay 200ms ease allow-discrete;
}

dialog::backdrop {
  opacity: 0;
  transition:
    display 200ms allow-discrete,
    overlay 200ms allow-discrete,
    opacity 200ms;
}

/* 2. The Open State */
dialog[open] {
  opacity: 1;
  scale: 1;
}

dialog[open]::backdrop {
  opacity: 1;
}

/* 3. Opening Animation (Entry) */
@starting-style {
  dialog[open] {
    opacity: 0;
    scale: 0.95;
  }

  dialog[open]::backdrop {
    opacity: 0;
  }
}
</style>
