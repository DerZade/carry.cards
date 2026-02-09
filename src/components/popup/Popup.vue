<template>
  <Dialog
    v-model:visible="visible"
    style="min-inline-size: min(100dvi - 10rem, 30rem); place-content: center"
    @close="emit('close')"
  >
    <div v-if="options.heading || closable" class="grid grid-cols-[1fr_auto] items-center">
      <h2 class="text-xl font-semibold">{{ options.heading }}</h2>
      <button :disabled="closeDisabled" class="btn-icon" @click="visible = false">
        <X />
      </button>
    </div>
    {{ options.body }}
    <slot />
  </Dialog>
</template>

<script lang="ts" setup>
import { X } from 'lucide-vue-next'
import type { CommonOpts } from '.'
import Dialog from '@/components/Dialog.vue'

defineProps<{
  closable?: boolean
  closeDisabled?: boolean
  options: CommonOpts
}>()

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: () => any
}>()

const visible = defineModel<boolean>('modelValue', { required: true })
</script>
