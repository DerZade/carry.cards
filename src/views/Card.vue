<template>
  <div v-if="card" class="p-4">
    <div class="aspect-(--card-aspect-ratio) card-bg rounded-3xl overflow-hidden relative">
      <RenderedCode
        :format="card.format"
        :rawValue="card.rawValue"
        class="absolute rounded-xl inset-x-[10%] inset-y-[calc(10%*var(--card-aspect-ratio))]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cards'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

import RenderedCode from '@/components/RenderedCode.vue'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  'update:title': [string]
}>()

const store = useCardsStore()
const { cards } = storeToRefs(store)

const card = computed(() => cards.value.find((card) => card.id === props.id))

watch(
  card,
  (val) => {
    if (!val) return

    emit('update:title', val.displayName)
  },
  { immediate: true },
)
</script>

<style scoped>
.card-bg {
  background-color: v-bind('card?.color');
}
</style>
