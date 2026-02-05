<template>
  <div class="grid grid-flow-col items-center justify-start gap-2">
    <input type="checkbox" v-model="modelValue" :id="id" class="size-5" />
    <label :for="id" class="text-foreground-muted">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  label: string
}>()

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: () => any
}>()

const id = useId()
</script>
