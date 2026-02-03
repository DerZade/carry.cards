<template>
  <pre>{{ formattedRawValue }}</pre>
</template>

<script lang="ts" setup>
import type { SupportedBarcodeFormat } from '@/utils/code'
import { computed } from 'vue'

const { rawValue } = defineProps<{
  format: SupportedBarcodeFormat
  rawValue: string
}>()

const formattedRawValue = computed(() => {
  if (rawValue.length === 0) return rawValue

  if (rawValue.match(/^[0-9]+$/)) {
    // numeric only
    if (rawValue.length % 4 === 0) return rawValue.match(/.{1,4}/g)?.join(' ') ?? rawValue
    if (rawValue.length % 5 === 0) return rawValue.match(/.{1,5}/g)?.join(' ') ?? rawValue
  }
  return rawValue
})
</script>
