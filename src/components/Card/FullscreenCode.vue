<template>
  <HTMLDialog
    v-model:visible="visible"
    class="inset-0 outline-none overflow-hidden backdrop:bg-white bg-transparent m-auto p-4 grid gap-4 grid-rows-[1fr_auto] max-bs-[100dvb] max-is-[100dvi] cursor-zoom-out"
    style="writing-mode: sideways-lr"
    :style="{ 'writing-mode': rotated ? 'vertical-rl' : 'horizontal-tb' }"
    @click="visible = false"
  >
    <div class="overflow-hidden flex justify-center">
      <RenderedCode
        :format="format"
        :rawValue="rawValue"
        :rotate="rotated"
        class="object-contain object-center max-is-full max-bs-full"
        :width="windowMax"
      />
    </div>
    <FormattedValue
      class="text-black text-center text-3xl shrink-0 overflow-hidden wrap-anywhere text-wrap"
      :rawValue
      :format
    />
  </HTMLDialog>
</template>

<script lang="ts" setup>
import RenderedCode from '@/components/RenderedCode.vue'
import HTMLDialog from '@/components/HTMLDialog.vue'
import FormattedValue from '../FormattedValue.vue'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { FORMATS, type SupportedBarcodeFormat } from '@/utils/code'

const { format } = defineProps<{
  format: SupportedBarcodeFormat
  rawValue: string
}>()

const visible = defineModel<boolean>('visible', { required: true })

const { width, height } = useWindowSize()
const windowMax = computed(() => Math.max(width.value, height.value))

const rotated = computed(() => {
  const heightMore = height.value > width.value
  return (!heightMore && FORMATS[format].square) || (heightMore && !FORMATS[format].square)
})
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
