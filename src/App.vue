<template>
  <Toaster />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WifiOff } from 'lucide-vue-next'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { toastAction, Toaster, useToast } from '@/components/toast'

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
