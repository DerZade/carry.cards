<template>
  <Popup v-model="visible" :options="options" :closeDisabled="loading" @close="emit('reject')">
    <form @submit.prevent="submit">
      <component
        :is="unref(options.customInputComponent)"
        v-if="options.customInputComponent"
        v-model="value"
        :initialValue="options.initialValue"
        :disabled="loading || undefined"
        v-bind="options.customInputProps"
      />
      <input v-else v-model="value" type="text" required autofocus :disabled="loading" />
      <PopupActions
        v-model:loading="loading"
        class="mbs-4"
        :options="options"
        @cancel="
          () => {
            visible = false
            emit('reject')
          }
        "
      />
    </form>
  </Popup>
</template>

<script lang="ts" setup>
import { ref, toRefs, unref } from 'vue'
import type { PromptOpts } from '.'
import { usePopupSubmit } from './usePopupSubmit'
import Popup from './Popup.vue'
import PopupActions from './PopupActions.vue'

// TODO: Use generics
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueType = any

const props = defineProps<{
  options: PromptOpts<ValueType>
}>()
const { options } = toRefs(props)

const value = ref<ValueType>(props.options.initialValue)

const emit = defineEmits<{
  resolve: [ValueType]
  reject: []
}>()

const visible = ref(true)
const { loading, submit: submitBase } = usePopupSubmit<ValueType>(options, visible, emit)

async function submit() {
  await submitBase(value.value)
}
</script>
