<template>
  <HTMLDialog
    v-model:visible="visible"
    class="fixed inset-0 bs-[100dvb] is-[100dvi] min-bs-[100dvb] min-is-[100dvi] outline-none overflow-hidden backdrop:bg-surface bg-transparent"
    @close="image = null"
  >
    <button
      type="button"
      class="absolute block-start-4 inline-end-4 btn-surface aspect-square p-2"
      @click="handleClose"
    >
      <X />
    </button>
    <div
      v-if="image"
      class="absolute inset-0 p-4 overflow-hidden z-[-1] grid place-content-center"
      ref="wrapper"
    >
      <Image
        :image="image"
        class="rounded-lg is-auto bs-auto max-is-full max-bs-full overflow-hidden origin-top-left pointer-events-none"
        :style="imageStyle"
        ref="image"
      />
    </div>
  </HTMLDialog>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { StoredImage } from '@/types'
import HTMLDialog from '@/components/HTMLDialog.vue'
import Image from '@/components/Image.vue'
import { usePanZoomEl } from '@/composables/usePanZoomEl'
import { unrefElement } from '@vueuse/core'

const image = defineModel<StoredImage | null>({ required: true })

const visible = computed(() => !!image.value)

function handleClose() {
  image.value = null
}

const wrapperEl = useTemplateRef('wrapper')
const imageEl = useTemplateRef('image')

const { style: imageStyle, reset: resetPanZoom } = usePanZoomEl(
  wrapperEl,
  () => unrefElement(imageEl) ?? null,
)
watch(visible, resetPanZoom)
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
