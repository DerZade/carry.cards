import { readonly, ref, unref, type MaybeRef, type Ref } from 'vue'
import { PopupSubmitEvent } from '.'
import { useLogger } from '@/composables/useLogger'

/**
 * Composable which includes submission logic for Confirm, Prompt and Select popups.
 *
 * It handles:
 * - setting the loading state
 * - calling the onSubmit callback from the options (if one is set)
 * - closing the popup upon submission
 * - emitting the resolve or reject event depending on the success of the submission
 *
 * @param options Popup options
 * @param visible Ref to the visibility of the popup
 * @param emit Emit function of the component
 */
export function usePopupSubmit<T>(
  options: MaybeRef<{
    onSubmit?: (event: PopupSubmitEvent<T>) => boolean | void | Promise<boolean | void>
  }>,
  visible: Ref<boolean>,
  emit: ((event: 'resolve', value: T) => void) & ((event: 'reject') => void),
) {
  const loading = ref(false)

  const { warn, error } = useLogger()

  async function submit(value: T) {
    loading.value = true

    try {
      let successful = true
      const opts = unref(options)

      if (opts.onSubmit) {
        const event = new PopupSubmitEvent<T>(value)
        successful = (await opts.onSubmit(event)) ?? true

        if (event.defaultPrevented) return
      }

      visible.value = false

      if (successful) {
        emit('resolve', value)
      } else {
        emit('reject')
      }
    } catch (err) {
      warn(
        'An error occurred, within the onSubmit callback of a popup. Please handle errors separately',
      )
      error(err)
    } finally {
      loading.value = false
    }
  }

  return { submit, loading: readonly(loading) }
}
