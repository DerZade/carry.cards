import type { TranslationItem } from '@/composables/useEnhancedI18n'
import { h, markRaw, readonly, type Component } from 'vue'
import { ref } from 'vue'
import Toaster from './Toaster.vue'
import ToastAction from './ToastAction.vue'
import ToastDismissAction from './ToastDismissAction.vue'

export { Toaster, ToastAction, ToastDismissAction }

interface ToastOptions {
  /** Icon component to show in the toast */
  icon?: Component | null

  /**
   * Text of the toast.
   *
   * This will be directly passed to the `v-t` directive.
   * So either just a i18n path or a object with a path and options
   */
  text: TranslationItem

  /** Show loader */
  action?: Component | null

  /** Duration, use `-1` for no timeout */
  duration?: number
}

export type ToastID = string

const STATE = {
  toasts: ref<(Required<ToastOptions> & { id: ToastID })[]>([]),
  timeouts: new Map<ToastID, number>(),
}

const DEFAULTS: Omit<Required<ToastOptions>, 'text'> = {
  icon: null,
  duration: 3000,
  action: markRaw(ToastDismissAction),
} as const

function withDefaults(options: ToastOptions): Required<ToastOptions> {
  const icon = options.icon ? markRaw(options.icon) : DEFAULTS.icon
  const action = options.action ? markRaw(options.action) : DEFAULTS.action

  return {
    text: options.text,
    icon,
    duration: options.duration ?? DEFAULTS.duration,
    action,
  }
}

function clearToastTimeout(id: ToastID) {
  const to = STATE.timeouts.get(id)
  if (to === undefined) return
  STATE.timeouts.delete(id)

  window.clearTimeout(to)
}

function scheduleToastTimeout(id: ToastID) {
  const toast = STATE.toasts.value.find((x) => x.id === id)

  if (toast === undefined) return
  if (toast.duration < 0) return

  STATE.timeouts.set(
    id,
    window.setTimeout(() => hide(id), toast.duration),
  )
}

function show(options: ToastOptions & { id?: ToastID }): ToastID {
  if (options.id !== undefined && STATE.toasts.value.some((x) => x.id === options.id)) {
    const { id, ...opts } = options
    update(id, opts)

    return options.id
  }

  const id = crypto.randomUUID()

  STATE.toasts.value.push({ ...withDefaults(options), id })

  scheduleToastTimeout(id)

  return id
}

function hide(id: ToastID) {
  clearToastTimeout(id)
  const index = STATE.toasts.value.findIndex((x) => x.id === id)

  if (index < 0) return

  STATE.toasts.value.splice(index, 1)
}

function update(id: ToastID, options: ToastOptions) {
  clearToastTimeout(id)
  const index = STATE.toasts.value.findIndex((x) => x.id === id)

  if (index < 0) return

  STATE.toasts.value.splice(index, 1, { ...withDefaults(options), id })

  scheduleToastTimeout(id)
}

export function useToast() {
  return {
    toasts: readonly(STATE.toasts),
    showToast: show,
    hideToast: hide,
    updateToast: update,
  }
}

export function toastAction(text: string, onClick: () => void): Component {
  return h(ToastAction, { onClick: onClick }, { default: () => text })
}
