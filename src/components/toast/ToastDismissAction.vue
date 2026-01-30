<template>
  <button type="button" class="btn-icon" @click="emit('hide')"><X /></button>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const emit = defineEmits<{
  hide: []
}>()
</script>
