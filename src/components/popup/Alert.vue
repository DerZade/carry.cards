<template>
  <Popup v-model="visible" :options="options" @close="emit('resolve')">
    <div class="grid justify-end">
      <button
        class="btn-primary"
        @click="
          () => {
            visible = false
            emit('resolve')
          }
        "
      >
        {{ t(options.primaryAction ?? 'understood') }}
      </button>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useEnhancedI18n } from '@/composables/useEnhancedI18n'
import type { AlertOpts } from '.'
import Popup from './Popup.vue'

defineProps<{
  options: AlertOpts
}>()

const { t } = useEnhancedI18n()

const visible = ref(true)

const emit = defineEmits<{
  resolve: []
}>()
</script>
