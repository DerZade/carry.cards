<template>
  <div class="grid gap-2">
    <div
      v-if="previewUrl"
      class="relative rounded-md border border-border bg-surface p-4 flex items-center justify-center shadow-sm"
    >
      <img :src="previewUrl" alt="Preview" class="max-is-full max-bs-32 object-contain" />
      <button
        type="button"
        class="absolute block-start-2 inline-end-2 btn-icon"
        @click="removeImage"
        :aria-label="t('remove_image')"
      >
        <Trash2 />
      </button>
    </div>
    <label
      v-else
      :for="inputId"
      class="cursor-pointer rounded-md border border-border bg-surface px-4 py-8 grid items-center justify-items-center gap-2 hover:border-foreground-muted transition-all shadow-sm outline-none"
    >
      <Upload :size="32" class="text-foreground/60" />
      <span class="text-sm text-foreground/60">{{ t('click_to_upload') }}</span>
    </label>
    <input
      :id="inputId"
      ref="fileInputEl"
      type="file"
      accept="image/*"
      class="sr-only"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'
import { Upload, Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'

const blob = defineModel<Blob | null>({ required: true })

const { t } = useI18n()
const inputId = useId()
const fileInputEl = ref<HTMLInputElement>()
const previewUrl = useObjectUrl(blob)

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  blob.value = file
}

function removeImage() {
  blob.value = null

  // Clear file input
  if (fileInputEl.value) {
    fileInputEl.value.value = ''
  }
}
</script>
