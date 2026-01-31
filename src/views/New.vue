<template>
  <div
    v-if="permission !== 'granted'"
    class="full-page-size grid content-center justify-items-center gap-4 text-foreground px-2 text-center"
  >
    <Spinner v-if="permission === null" class="text-5xl" />
    <template v-else-if="permission === 'denied'">
      <TriangleAlert class="size-12 text-red-600 dark:text-red-400" />
      <h2 class="text-2xl font-bold mb-2">{{ t('new.camera_access_denied') }}</h2>
      <p class="text-foreground/70">
        {{ t('new.camera_access_denied_description') }}
      </p>
      <button @click="requestPermission" class="btn-primary">{{ t('new.try_again') }}</button>
      <button @click="goBack" class="btn-flat">{{ t('new.not_now') }}</button>
    </template>
    <template v-else-if="permission === 'prompt'">
      <Camera class="size-12 text-primary" />
      <h2 class="text-2xl font-bold mb-2">{{ t('new.camera_access_required') }}</h2>
      <p class="text-foreground/70">
        {{ t('new.camera_access_description') }}
      </p>
      <button @click="requestPermission" class="btn-primary">{{ t('new.grant_access') }}</button>
      <button @click="goBack" class="btn-flat">{{ t('new.not_now') }}</button>
    </template>
  </div>
  <Scanner v-else-if="!card" class="full-page-size" :constraints @submit="handleScanResult" />
  <form
    v-else
    class="px-4 grid gap-1 content-start full-page-size"
    @reset.prevent="card = null"
    @submit.prevent="addCard"
  >
    <label :for="displayNameID">{{ t('display_name') }}</label>
    <input
      :id="displayNameID"
      type="text"
      class="mbe-4"
      v-model="card.displayName"
      autofocus
      required
      ref="displayNameInputEl"
    />
    <label :for="colorID">{{ t('color') }}</label>
    <input :id="colorID" type="color" v-model="card.color" required class="w-full mbe-4" />
    <button type="submit" class="btn-primary mbs-4">{{ t('add_card') }}</button>
    <button type="reset" class="btn-flat">{{ t('new.try_again') }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, useId, useTemplateRef, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, TriangleAlert } from 'lucide-vue-next'
import { useCardsStore } from '@/stores/cards'
import { randomColor } from '@/utils/colors'
import { useEnhancedI18n } from '@/composables/useEnhancedI18n'
import Spinner from '@/components/Spinner.vue'
import type { Card } from '@/types'

const { t } = useEnhancedI18n()
const cardsStore = useCardsStore()

const Scanner = defineAsyncComponent(() => import('@/components/New/Scanner.vue'))

const permission = ref<PermissionState | null>(null)
const card = ref<Card | null>(null)

const constraints: MediaStreamConstraints = {
  video: {
    width: { ideal: 1500 },
    height: { ideal: 1500 },
    // Standard back camera hint
    facingMode: 'environment',
    // Advanced settings for focus and zoom
    advanced: [
      // @ts-expect-error | focusMode is just not in the types yet
      { focusMode: 'continuous' },
      // @ts-expect-error | zoom is just not in the types yet
      { zoom: 2.0 }, // Optional: Helps with close-up focus issues
    ],
  },
}

async function checkCameraPermission() {
  try {
    if (!navigator.permissions) {
      // If Permissions API not available, try to get camera directly
      permission.value = 'granted'
      return
    }

    const result = await navigator.permissions.query({ name: 'camera' })
    permission.value = result.state
  } catch {
    // If permission check fails, assume we need to request
    permission.value = 'prompt'
  }
}
checkCameraPermission()

async function requestPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    // Stop the stream immediately, we just needed to trigger the permission
    stream.getTracks().forEach((track) => track.stop())
    permission.value = 'granted'
  } catch {
    permission.value = 'denied'
  }
}

const router = useRouter()
function goBack() {
  router.back()
}

function handleScanResult({ format, rawValue }: Pick<DetectedBarcode, 'format' | 'rawValue'>) {
  card.value = { format, rawValue, displayName: '', color: randomColor(), id: crypto.randomUUID() }
}

const displayNameID = useId()
const colorID = useId()

// Focus the display name input when a new card is created
const displayNameInputEl = useTemplateRef('displayNameInputEl')
watch(card, (newCard, oldCard) => {
  if (oldCard === null && newCard !== null) {
    nextTick(() => {
      displayNameInputEl.value?.focus()
    })
  }
})

function addCard() {
  if (!card.value) return

  cardsStore.addCard(card.value)
  router.replace(`/card/${card.value.id}`)
}
</script>
