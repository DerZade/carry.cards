<template>
  <template v-for="p in popups" :key="p.id">
    <Alert v-if="isType(p, 'alert')" :options="p.options" @resolve="p.resolve" />
    <Confirm
      v-else-if="isType(p, 'confirm')"
      :options="p.options"
      @resolve="p.resolve"
      @reject="p.reject"
    />
    <Prompt
      v-else-if="isType(p, 'prompt')"
      :options="p.options"
      @resolve="p.resolve"
      @reject="p.reject"
    />
    <Select
      v-else-if="isType(p, 'select')"
      :options="p.options"
      @resolve="p.resolve"
      @reject="p.reject"
    />
  </template>
</template>

<script lang="ts" setup>
import { usePopup, type PopupOptionsMap, type Popup } from '.'
import Alert from './Alert.vue'
import Confirm from './Confirm.vue'
import Prompt from './Prompt.vue'
import Select from './Select.vue'

const { popups } = usePopup()

function isType<T extends keyof PopupOptionsMap>(
  popup: Popup<keyof PopupOptionsMap>,
  type: T,
): popup is Popup<T> {
  return popup.type === type
}
</script>
