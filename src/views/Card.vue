<template>
  <template v-if="!card">
    <Spinner class="m-4" />
  </template>
  <div v-else class="p-4 pbs-0 grid overflow-hidden max-is-2xl mx-auto">
    <Teleport to="#header-end">
      <RouterLink class="btn-flat-brand" :to="{ name: 'edit', params: { id: card.id } }">
        {{ t('edit') }}
      </RouterLink>
    </Teleport>
    <FullscreenCode v-model:visible="fullscreen" :format="card.format" :rawValue="card.rawValue" />
    <FullscreenImageDialog v-model="fullscreenImage" />
    <div
      class="aspect-(--card-aspect-ratio) rounded-2xl overflow-hidden grid grid-rows-[1fr_2fr] card-transition shadow-lg"
      style="container-type: inline-size"
    >
      <header class="card-bg overflow-hidden flex justify-center p-2">
        <Image v-if="card.logo" :image="card.logo" class="self-stretch is-auto" />
        <h2
          v-else
          class="text-[clamp(1rem,7cqi,5rem)] overflow-hidden text-ellipsis self-center text-center font-heading font-semibold"
        >
          {{ card.displayName }}
        </h2>
      </header>
      <main
        class="cursor-zoom-in bg-white p-3 grid grid-rows-[1fr_auto] grid-cols-[1fr_auto_1fr] gap-1 overflow-hidden justify-items-center"
        @click="fullscreen = true"
      >
        <RenderedCode
          :format="card.format"
          :rawValue="card.rawValue"
          class="overflow-hidden max-bs-full col-start-1 col-end-4 self-stretch"
        />
        <FormattedValue
          :format="card.format"
          :rawValue="card.rawValue"
          class="text-black text-center text-[clamp(1rem,5cqi,5rem)] col-start-2 overflow-hidden text-ellipsis max-is-full"
        />
        <Maximize2 class="text-neutral-400 pointer-events-none justify-self-end self-end" />
      </main>
    </div>

    <section class="mbs-8 grid grid-cols-2 gap-y-2 gap-x-4">
      <h2 class="text-lg font-semibold col-span-2">{{ t('physical_card') }}</h2>
      <PhysicalCardPhoto
        :modelValue="card.frontImage"
        :fileName="card.id + '-front'"
        @update:modelValue="(img) => updateImage(img, 'front')"
        @open="fullscreenImage = $event"
      />
      <PhysicalCardPhoto
        :modelValue="card.backImage"
        :fileName="card.id + '-back'"
        @update:modelValue="(img) => updateImage(img, 'back')"
        @open="fullscreenImage = $event"
      />
      <label class="text-sm text-foreground text-center">{{ t('front_image') }}</label>
      <label class="text-sm text-foreground text-center">{{ t('back_image') }}</label>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cards'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Maximize2 } from 'lucide-vue-next'
import type { Card, StoredImage } from '@/types'

import RenderedCode from '@/components/RenderedCode.vue'
import Spinner from '@/components/Spinner.vue'
import Image from '@/components/Image.vue'
import FullscreenCode from '@/components/Card/FullscreenCode.vue'
import FullscreenImageDialog from '@/components/Card/FullscreenImageDialog.vue'
import FormattedValue from '@/components/FormattedValue.vue'
import PhysicalCardPhoto from '@/components/Card/PhysicalCardPhoto.vue'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  'update:title': [string]
}>()

const { t } = useI18n()

const store = useCardsStore()
const { cards } = storeToRefs(store)

// we only update on id changes, to avoid flashes
// when deleting the card and navigating away
const card = ref<Card>()
function updateThisCard() {
  card.value = cards.value.find((card) => card.id === props.id)
}
watch(() => props.id, updateThisCard, { immediate: true })

const fullscreenImage = ref<StoredImage | null>(null)
const fullscreen = ref(false)

watch(
  card,
  (val) => {
    if (!val) return
    emit('update:title', val?.displayName)
  },
  { immediate: true },
)

async function updateImage(file: StoredImage | null | undefined, side: 'front' | 'back') {
  if (!card.value) return

  await store.updateCard({
    ...card.value,
    [`${side}Image`]: file,
  })

  updateThisCard()
}
</script>

<style scoped>
.card-bg {
  background-color: v-bind('card?.color');
}

.card-transition {
  view-transition-name: v-bind('`card-${id}`');
}
</style>
