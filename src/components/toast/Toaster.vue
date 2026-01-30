<template>
  <Teleport to="body">
    <TransitionGroup
      name="toasts"
      tag="ul"
      class="fixed inset-0 justify-end isolate flex flex-col items-center pointer-events-none px-4"
    >
      <li
        v-for="{ id, icon, text, action } in toasts"
        :key="id"
        class="flex items-center gap-3 bg-background border border-foreground/20 rounded-lg px-4 py-3 min-is-0 max-is-md is-full pointer-events-auto shadow-lg mbe-2"
      >
        <component :is="icon" v-if="icon" class="shrink-0" />
        <span class="flex-1 text-foreground">{{ text }}</span>
        <component :is="action" v-if="action" class="shrink-0" @hide="hideToast(id)" />
      </li>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '.'

const { toasts, hideToast } = useToast()
</script>

<style scoped>
.toasts-enter-from,
.toasts-leave-to {
  opacity: 0;
  max-block-size: 0;
  margin-block-end: 0;
  padding-block: 0;
}

.toasts-enter-to,
.toasts-leave-from {
  opacity: 1;
  max-block-size: 100px;
  margin-block-end: calc(2 * var(--spacing));
}

.toasts-enter-active {
  transition: all 0.3s ease-out;
}

.toasts-leave-active {
  transition: all 0.2s ease-in;
}

.toasts-move {
  transition: transform 0.3s ease;
}
</style>
