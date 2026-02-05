<template>
  <menu class="grid gap-2 grid-flow-col justify-end">
    <button
      :class="{
        'btn-flat-foreground': !options.destructive,
        'btn-flat-danger': options.destructive,
      }"
      :disabled="loading || disabled"
      :color="actionColor"
      @click="emit('cancel')"
    >
      {{ t('cancel') }}
    </button>
    <button
      :class="{
        'btn-foreground': !options.destructive,
        'btn-danger': options.destructive,
        relative: true,
        'pointer-events-none': loading,
      }"
      type="submit"
      :disabled="disabled"
      :loading="loading"
    >
      {{ t(options.primaryAction ?? 'confirm') }}
      <div
        v-if="loading"
        class="absolute inset-0 bg-inherit rounded-[inherit] text-3xl flex items-center justify-center"
      >
        <Spinner class="text-inherit" />
      </div>
    </button>
  </menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useEnhancedI18n } from '@/composables/useEnhancedI18n'
import type { ActionOpts } from '.'
import Spinner from '@/components/Spinner.vue'

const props = defineProps<{
  options: ActionOpts
  loading: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  cancel: []
}>()

const { t } = useEnhancedI18n()

const actionColor = computed(() => (props.options.destructive ? 'danger' : 'foreground'))
</script>
