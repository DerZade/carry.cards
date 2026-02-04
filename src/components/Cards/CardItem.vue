<template>
  <li :aria-labelledby="labelId">
    <RouterLink
      class="grid grid-rows-[auto_auto] gap-1 items-stretch"
      :to="{ name: 'card', params: { id: card.id } }"
    >
      <div class="relative rounded-lg p-2 aspect-(--card-aspect-ratio) card-transition shadow-lg">
        <div class="bg-white/15 absolute inset-x-0 block-start-[20%] bs-[20%]"></div>
        <Image
          v-if="card.logo"
          :image="card.logo"
          class="absolute block-end-[calc(5%*var(--card-aspect-ratio))] start-[5%] bs-[45%] is-[90%] object-contain object-bottom-center"
        />
        <component
          v-else
          :is="Icon"
          class="text-white/50 absolute block-end-[calc(5%*var(--card-aspect-ratio))] end-[5%] bs-[30%] w-auto"
        />
      </div>
      <span :id="labelId" class="text-center font-semibold truncate text-sm font-heading">{{
        card.displayName
      }}</span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { computed, type DeepReadonly, useId } from 'vue'
import { QrCode, Barcode } from 'lucide-vue-next'
import type { Card } from '@/types'
import { getCodeType } from '@/utils/code'
import Image from '@/components/Image.vue'

const props = defineProps<{
  card: DeepReadonly<Card>
}>()

const Icon = computed(() => (getCodeType(props.card.format) === 'qr' ? QrCode : Barcode))

const labelId = useId()
</script>

<style scoped>
li > a > div:first-child {
  background-color: v-bind('card.color');
}

.card-transition {
  view-transition-name: v-bind('`card-${card.id}`');
}
</style>
