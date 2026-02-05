import Checkbox from '@/components/Checkbox.vue'
import { usePopup, UserAbortError } from '@/components/popup'
import { deleteFile, NotPersistentStorageError, saveFile } from '@/utils/storage'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export function useSaveFile() {
  const { prompt } = usePopup()

  const { t } = useI18n({ useScope: 'global' })

  const showWarning = useLocalStorage('warnNotPersistedStorage', true)

  async function wrappedSaveFile(path: string, blob: Blob): Promise<boolean> {
    try {
      await saveFile(path, blob)
      return true
    } catch (err) {
      if (!(err instanceof NotPersistentStorageError)) {
        throw err
      }
    }

    // saveFile threw NotPersistentStorageError, ask user if they really want to save

    if (!showWarning.value) return true

    try {
      const doNotAskAgain = await prompt<boolean>({
        heading: t('file_not_persisted.heading'),
        body: t('file_not_persisted.body'),
        initialValue: false,
        primaryAction: 'save_anyway',
        customInputComponent: Checkbox,
        customInputProps: {
          label: t('file_not_persisted.do_not_ask_again'),
        },
      })

      console.log(doNotAskAgain)

      showWarning.value = !doNotAskAgain
      return true
    } catch (err) {
      if (err instanceof UserAbortError) {
        await deleteFile(path)
        return false
      } else throw err
    }
  }

  return {
    saveFile: wrappedSaveFile,
  }
}
