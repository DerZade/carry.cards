<template>
  <nav
    class="grid items-center gap-2 min-bs-[--spacing(18)] p-4 grid-cols-[.5fr_auto_.5fr] sticky block-start-0 bg-background z-10"
  >
    <button
      v-if="route.meta['showBack']"
      class="btn-icon justify-self-start"
      @click="router.back()"
    >
      <ChevronLeft class="size-6" />
    </button>
    <h1
      v-if="title || route.meta['title']"
      class="col-start-2 truncate text-lg text-center font-heading font-bold"
      style="letter-spacing: 0.05em"
    >
      <span v-if="title">{{ title }}</span>
      <span v-else-if="typeof route.meta['title'] === 'string'">{{ t(route.meta['title']) }}</span>
    </h1>
    <div id="header-end" class="col-start-3 justify-self-end"></div>
  </nav>
  <main>
    <RouterView @update:title="title = $event" />
  </main>
  <PopupHandler />
  <Toaster />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ChevronLeft, WifiOff } from 'lucide-vue-next'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { toastAction, Toaster, useToast } from '@/components/toast'
import { PopupHandler } from './components/popup'

const route = useRoute()

const title = ref<string>()
watch(route, () => {
  title.value = undefined
})

const router = useRouter()

const { showToast } = useToast()

const { t } = useI18n({ useScope: 'global' })

const { updateServiceWorker } = useRegisterSW({
  immediate: true,
  onOfflineReady: () =>
    showToast({
      text: t('pwa.ready_to_work_offline'),
      icon: WifiOff,
      duration: 5000,
    }),
  onNeedRefresh: () =>
    showToast({
      text: t('pwa.new_version_available'),
      duration: -1,
      action: toastAction(t('pwa.update_now'), () => {
        console.log('Updating service worker...')
        updateServiceWorker(true)
      }),
    }),
})
</script>

<style>
/* Ensure navbar stays on top during view transitions */
nav {
  view-transition-name: header;
}

::view-transition-group(header) {
  z-index: 100;
}
</style>
