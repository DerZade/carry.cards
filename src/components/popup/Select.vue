<template>
  <Popup
    v-model="visible"
    :options="options"
    closable
    :closeDisabled="loading"
    @close="emit('reject')"
  >
    <ul class="grid gap-1">
      <li
        v-for="({ displayName, value }, index) in options.options"
        :key="index"
        class="py-2 px-4 rounded cursor-pointer hover:bg-foreground/5 focus-visible:bg-foreground/5 outline-none transition-colors aria-disabled:pointer-events-none grid grid-cols-[1fr_auto] items-center gap-2"
        :aria-disabled="loading"
        :tabindex="loading ? -1 : 0"
        @click="submit(value)"
      >
        <span>{{ displayName }}</span>
        <div v-if="loading && loadingValue === value" avatar>
          <Spinner class="text-2xl" />
        </div>
      </li>
    </ul>
  </Popup>
</template>

<script lang="ts" setup generic="T">
import { ref, toRefs } from 'vue'
import type { SelectOpts } from '.'
import { usePopupSubmit } from './usePopupSubmit'
import Popup from './Popup.vue'
import Spinner from '@/components/Spinner.vue'

const props = defineProps<{
  options: SelectOpts<T>
}>()
const { options } = toRefs(props)

const emit = defineEmits<{
  resolve: [T]
  reject: []
}>()

const visible = ref(true)
const loadingValue = ref<T>()
const { loading, submit: submitBase } = usePopupSubmit(options, visible, emit)

async function submit(value: T) {
  loadingValue.value = value

  try {
    await submitBase(value)
  } finally {
    loadingValue.value = undefined
  }
}
</script>
