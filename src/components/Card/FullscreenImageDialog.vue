<template>
  <HTMLDialog
    v-model:visible="visible"
    class="fixed inset-0 bs-[100dvb] is-[100dvi] min-bs-[100dvb] min-is-[100dvi] outline-none overflow-hidden backdrop:bg-surface bg-transparent flex"
    @close="image = null"
  >
    <button
      type="button"
      class="absolute block-start-4 inline-end-4 btn-surface aspect-square p-2"
      @click="handleClose"
      :aria-label="t('close')"
    >
      <X />
    </button>
    <Image
      v-if="image"
      :image="image"
      class="rounded-lg max-bs-[calc(100%---spacing(8))] max-is-[calc(100%---spacing(8))] is-auto bs-auto m-auto"
    />
  </HTMLDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'
import type { StoredImage } from '@/types'
import HTMLDialog from '@/components/HTMLDialog.vue'
import Image from '@/components/Image.vue'

const image = defineModel<StoredImage | null>({ required: true })

const visible = computed(() => !!image.value)

const { t } = useI18n({ useScope: 'global' })

function handleClose() {
  image.value = null
}
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
