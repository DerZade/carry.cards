<template>
  <nav
    class="grid items-center gap-2 min-bs-14 p-2 grid-cols-[theme(size.9)_1fr_theme(size.9)] sticky block-start-0 bg-background z-10"
  >
    <button v-if="route.meta['showBack']" class="btn-icon" @click="router.back()">
      <ChevronLeft class="size-4" />
    </button>
    <h1 v-if="title || route.meta['title']" class="col-start-2 truncate text-lg text-center">
      <span v-if="title">{{ title }}</span>
      <span v-else-if="typeof route.meta['title'] === 'string'">{{ t(route.meta['title']) }}</span>
    </h1>
  </nav>
  <main>
    <RouterView @update:title="title = $event" />
  </main>
  <Toaster />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ChevronLeft, WifiOff } from 'lucide-vue-next'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { toastAction, Toaster, useToast } from '@/components/toast'

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
