<template>
  <img v-if="url" :src="url" :width="image.width" :height="image.height" v-bind="$attrs" />
  <div
    v-else
    :style="{ width: `${image.width}px`, height: `${image.height}px` }"
    class="bg-surface border border-foreground-muted"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useObjectUrl } from '@vueuse/core'
import { ref, watch } from 'vue'
import type { StoredImage } from '@/types'
import { getFile } from '@/utils/storage'

const { image } = defineProps<{
  image: StoredImage
}>()

defineOptions({
  inheritAttrs: false,
})

const file = ref<Blob | null>(null)
const url = useObjectUrl(file)
const error = ref<unknown | null>(null)

watch(
  () => image.path,
  async () => {
    error.value = null
    try {
      file.value = await getFile(image.path)
    } catch (err) {
      error.value = err
    }
  },
  { immediate: true },
)
</script>
