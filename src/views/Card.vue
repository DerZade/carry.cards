<template>
  <template v-if="!card">
    <Spinner class="m-4" />
  </template>
  <div
    v-else-if="fullscreen"
    class="fixed inset-0 bg-red isolate z-100 overflow-hidden"
    @click="fullscreen = false"
  >
    <RenderedCode
      :format="card.format"
      :rawValue="card.rawValue"
      class="h-dvw w-dvh origin-top-left transform-[rotate(90deg)_translateY(-100%)]"
    />
  </div>
  <div v-else class="p-4">
    <div
      class="aspect-(--card-aspect-ratio) card-bg rounded-3xl overflow-hidden relative card-transition"
    >
      <RenderedCode
        @click="fullscreen = true"
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
import { computed, ref, watch } from 'vue'

import RenderedCode from '@/components/RenderedCode.vue'
import Spinner from '@/components/Spinner.vue'

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

const fullscreen = ref(false)
</script>

<style scoped>
.card-bg {
  background-color: v-bind('card?.color');
}

.card-transition {
  view-transition-name: v-bind('`card-${id}`');
}
</style>
