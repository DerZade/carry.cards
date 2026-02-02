<template>
  <img :src="url" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { toSVG } from '@bwip-js/browser'
import { FORMATS, type SupportedBarcodeFormat } from '@/utils/code'

const {
  format,
  rawValue,
  rotate = false,
} = defineProps<{
  format: SupportedBarcodeFormat
  rawValue: string
  rotate?: boolean
}>()

const url = ref<string>()

function render() {
  const { bcid, square } = FORMATS[format]

  const { scaleX, scaleY } = square ? { scaleX: 10, scaleY: 10 } : { scaleX: 1, scaleY: 1 }

  const svg = toSVG({
    bcid,
    text: rawValue,
    includetext: false,
    scaleX,
    scaleY,
    guardwhitespace: false,

    rotate: rotate ? 'R' : 'N',
  })

  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
  url.value = dataUrl
}

watch(() => format, render)
watch(() => rawValue, render)
watch(() => rotate, render)
render()
</script>
