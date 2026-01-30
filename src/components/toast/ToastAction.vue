<template>
  <button type="button" class="btn-flat"><slot /></button>
</template>

<script setup lang="ts">
defineSlots<{
  default: () => unknown
}>()
</script>
