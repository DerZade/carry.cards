<template>
  <Popup v-model="visible" :options="options" :closeDisabled="loading" @close="emit('reject')">
    <form @submit.prevent="submit">
      <PopupActions
        :loading="loading"
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
import { ref, toRefs } from 'vue'
import type { ConfirmOpts } from '.'
import { usePopupSubmit } from './usePopupSubmit'
import Popup from './Popup.vue'
import PopupActions from './PopupActions.vue'

const props = defineProps<{
  options: ConfirmOpts
}>()
const { options } = toRefs(props)

const emit = defineEmits<{
  resolve: []
  reject: []
}>()

const visible = ref(true)
const { loading, submit: submitBase } = usePopupSubmit<void>(options, visible, emit)

async function submit() {
  await submitBase()
}
</script>
