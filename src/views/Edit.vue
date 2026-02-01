<template>
  <form v-if="card" class="px-4 grid gap-1 content-start full-page-size" @submit.prevent="submit">
    <label :for="displayNameID">{{ t('display_name') }}</label>
    <input
      :id="displayNameID"
      type="text"
      class="mbe-4"
      v-model="displayName"
      autofocus
      required
      ref="displayNameInputEl"
    />
    <label :for="colorID">{{ t('color') }}</label>
    <input :id="colorID" type="color" v-model="color" required class="mbe-4" />
    <button type="submit" class="btn-primary mbs-4">{{ t('save') }}</button>
  </form>
</template>

<script setup lang="ts">
import { useCardsStore } from '@/stores/cards'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { dequal } from 'dequal/lite'
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRouter,
  type RouteLocationNormalized,
} from 'vue-router'

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

const card = computed(() => cards.value.find((card) => card.id === props.id))

const displayName = ref('')
const color = ref('#ffffff')

watch(displayName, (val) => {
  if (!card.value) return
  emit('update:title', val)
})

watch(
  card,
  (val) => {
    if (!val) return

    displayName.value = val.displayName
    color.value = val.color
  },
  { immediate: true },
)

watch(
  card,
  (val) => {
    if (!val) return

    emit('update:title', val.displayName)
  },
  { immediate: true },
)

const displayNameID = useId()
const colorID = useId()

function submit() {
  if (!card.value) return

  const { id, format, rawValue } = card.value

  store.updateCard({
    id,
    format,
    rawValue,
    displayName: displayName.value,
    color: color.value,
  })
  router.back()
}

const unsavedChanges = computed(
  () =>
    card.value &&
    (displayName.value !== card.value.displayName || color.value !== card.value.color),
)

function checkNavigation(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  if (!unsavedChanges.value) return true

  if (to.path === from.path && dequal(to.params, from.params)) return true

  const confirm = window.confirm(t('unsaved_changes') as string)
  if (!confirm) return false

  return true
}

onBeforeRouteUpdate(checkNavigation)
onBeforeRouteLeave(checkNavigation)

useEventListener('beforeunload', (e: BeforeUnloadEvent) => {
  if (!unsavedChanges.value) return
  e.preventDefault()
})
</script>
