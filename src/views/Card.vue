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
  <div v-else class="p-4 grid gap-8">
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
    <menu class="grid gap-4">
      <button class="btn-danger" @click="showDeleteDialog = true">
        <Trash />
        <span>{{ t('delete_card') }}</span>
      </button>
    </menu>

    <Dialog v-model:visible="showDeleteDialog" :heading="t('confirm_delete_title')">
      <p class="text-foreground/60">
        {{ t('confirm_delete_message', { name: card?.displayName }) }}
      </p>
      <menu class="grid grid-cols-2 gap-3">
        <button class="btn-secondary" @click="showDeleteDialog = false">
          {{ t('cancel') }}
        </button>
        <button class="btn-danger" @click="deleteCard">
          {{ t('delete') }}
        </button>
      </menu>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cards'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Trash } from 'lucide-vue-next'

import Dialog from '@/components/Dialog.vue'
import RenderedCode from '@/components/RenderedCode.vue'
import Spinner from '@/components/Spinner.vue'
import { computedWithControl } from '@vueuse/core'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  'update:title': [string]
}>()

const { t } = useI18n()
const router = useRouter()

const store = useCardsStore()
const { cards } = storeToRefs(store)

// we only update on id changes, to avoid flashes
// when deleting the card and navigating away
const card = computedWithControl(
  () => props.id,
  () => cards.value.find((card) => card.id === props.id),
)

watch(
  card,
  (val) => {
    if (!val) return

    emit('update:title', val.displayName)
  },
  { immediate: true },
)

const fullscreen = ref(false)
const showDeleteDialog = ref(false)

function deleteCard() {
  if (!card.value) return
  store.deleteCard({ id: card.value.id })
  router.replace({ name: 'cards' })
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
