<template>
  <div
    v-if="modelValue"
    class="aspect-(--card-aspect-ratio) rounded-lg cursor-pointer overflow-hidden grid place-content-center relative"
  >
    <Image :image="modelValue" class="absolute inset-0 bs-full is-full object-cover" />
    <button
      type="button"
      class="absolute block-start-2 inline-end-2 btn-surface aspect-square p-2"
      @click.stop="removeImage"
      :aria-label="t('remove_image')"
    >
      <Trash2 />
    </button>
  </div>
  <template v-else>
    <label
      :for="inputId"
      class="aspect-(--card-aspect-ratio) grid gap-1 rounded-lg border-2 border-dashed text-foreground-muted border-current hover:text-foreground focus-visible:text-foreground active:text-foreground place-content-center justify-items-center cursor-pointer outline-none transition-colors"
    >
      <ImagePlus />
      <span class="text-xs">{{ t('add_photo') }}</span>
    </label>
    <input :id="inputId" type="file" accept="image/*" class="sr-only" @change="handleFileChange" />
  </template>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { ImagePlus, Trash2 } from 'lucide-vue-next'
import type { StoredImage } from '@/types'
import Image from '@/components/Image.vue'
import { useSaveFile } from '@/composables/useSaveFile'
import { join } from 'pathe'
import { PHYSICAL_CARDS_DIRECTORY } from '@/utils/storage'
import { usePopup, UserAbortError } from '@/components/popup'
import { clampImageSize } from '@/utils/image'

const { fileName } = defineProps<{
  fileName: string
}>()

const modelValue = defineModel<StoredImage | null | undefined>()

const { t } = useI18n({ useScope: 'global' })

const inputId = useId()

const { saveFile } = useSaveFile()

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  target.value = ''

  const extension = file.type.split('/')[1]?.match(/^[a-z0-9]+/i) ?? 'png'
  const path = join('/', PHYSICAL_CARDS_DIRECTORY, `${fileName}.${extension}`)

  const { blob, width, height } = await clampImageSize(file, Number.POSITIVE_INFINITY)

  const saved = await saveFile(path, blob)
  if (!saved) return

  modelValue.value = { path, width, height }
}

const { confirm } = usePopup()

async function removeImage() {
  try {
    await confirm({
      destructive: true,
      heading: t('confirm_remove_image.heading'),
      body: t('confirm_remove_image.body'),
      primaryAction: 'delete',
    })
  } catch (err) {
    if (err instanceof UserAbortError) return
    throw err
  }

  modelValue.value = null
}
</script>
