import { markRaw, readonly, ref, type Component } from 'vue'
import type { TranslationItem } from '@/composables/useEnhancedI18n'
export { default as PopupHandler } from './PopupHandler.vue'

export class PopupSubmitEvent<T> extends Event {
  /** Value of */
  public readonly value: T

  constructor(value: T) {
    super('submit', { cancelable: true })
    this.value = value
  }
}

export interface CommonOpts {
  /** A heading to show */
  heading?: string

  /** The body of the modal */
  body?: string
}

export interface ActionOpts {
  /** Indicated that the action is destructive. Used to choose color of button */
  destructive?: boolean

  /** Text of primary action button */
  primaryAction?: TranslationItem
}

export type AlertOpts = CommonOpts & Pick<ActionOpts, 'primaryAction'>

export type ConfirmOpts = CommonOpts &
  ActionOpts & {
    /**
     * Callback when the user submits.
     * A loader is shown, while the returned promise is pending.
     * Callback is passed an event that can be used to cancel the
     * submission by calling `preventDefault` on said event.
     *
     * The return value indicates if the submission is successful. Returning
     * `false` is the same as if the user clicks cancel or closes the popup.
     * When retuning nothing it is assumed the the submission was successful.
     */
    onSubmit?: (event: PopupSubmitEvent<void>) => boolean | void | Promise<boolean | void>
  }

type CustomInputComponent<T> = Component<{ modelValue: T; initialValue?: T }>

export type PromptOpts<T = string> = CommonOpts &
  ActionOpts & {
    /**
     * Callback when the user submits.
     * A loader is shown, while the returned promise is pending.
     * Callback is passed an event that can be used to cancel the
     * submission by calling `preventDefault` on said event.
     *
     * The return value indicates if the submission is successful. Returning
     * `false` is the same as if the user clicks cancel or closes the popup.
     * When retuning nothing it is assumed the the submission was successful.
     */
    onSubmit?: (event: PopupSubmitEvent<T>) => boolean | void | Promise<boolean | void>

    /** Initial value of input */
    initialValue?: T

    /**
     * Custom component for input.
     *
     * It should have one v-model:
     * - `v-model(:modelValue)`: Model for the value that should be returned by the prompt.
     *
     * And receives these three props in addition to the props from `customInputProps`:
     * - `initialValue`-prop: Initial value from options
     * - `disabled`-prop: Disabled state (boolean | undefined)
     * - `disable`-prop: Disabled state (boolean | undefined)
     */
    customInputComponent?: CustomInputComponent<T> | undefined

    /**
     * Additional props for custom input component.
     */
    customInputProps?: Record<string, unknown>
  }

export type SelectOpts<T = string> = CommonOpts & {
  /**
   * Callback when the user submits.
   * A loader is shown, while the returned promise is pending.
   * Callback is passed an event that can be used to cancel the
   * submission by calling `preventDefault` on said event.
   *
   * The return value indicates if the submission is successful. Returning
   * `false` is the same as if the user clicks cancel or closes the popup.
   * When retuning nothing it is assumed the the submission was successful.
   */
  onSubmit?: (event: PopupSubmitEvent<T>) => boolean | void | Promise<boolean | void>

  /**
   * Options to select from
   */
  options: { displayName: string; value: T }[]
}

export class UserAbortError extends Error {
  public override readonly name = 'UserAbortError'

  constructor() {
    super('UserAbortError')
  }
}

export interface PopupOptionsMap {
  alert: AlertOpts
  confirm: ConfirmOpts
  prompt: PromptOpts
  select: SelectOpts
}

export interface Popup<T extends keyof PopupOptionsMap = keyof PopupOptionsMap> {
  id: symbol
  type: T
  options: PopupOptionsMap[T]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value?: any | PromiseLike<any>) => void
  reject: (reason?: unknown) => void
}

const POPUPS = ref<Popup[]>([])

export function usePopup() {
  /**
   * Show custom alert.
   * @param options Options
   * @returns Promise, which resolves after user has closed alert
   */
  function alert(options: AlertOpts): Promise<void> {
    const id = Symbol('popup')
    return new Promise<void>((resolve, reject) => {
      POPUPS.value.push({
        type: 'alert',
        id,
        options,
        resolve,
        reject: () => reject(new UserAbortError()),
      })
    }).finally(() => cleanup(id))
  }

  /**
   * Show custom confirm dialog.
   * @param options Options
   * @returns Promise, which resolves if user confirms and rejects with a {@link UserAbortError} if user cancels or closes the dialog.
   */
  function confirm(options: ConfirmOpts): Promise<void> {
    const id = Symbol('popup')
    return new Promise<void>((resolve, reject) => {
      POPUPS.value.push({
        type: 'confirm',
        id,
        options,
        resolve,
        reject: () => reject(new UserAbortError()),
      })
    }).finally(() => cleanup(id))
  }

  /**
   * Show custom prompt dialog.
   * @param options Options
   * @returns Promise, which resolves if user confirms and rejects with a {@link UserAbortError} if user cancels or closes the dialog.
   */
  function prompt<T>(options: PromptOpts<T>): Promise<T> {
    const id = Symbol('popup')
    return new Promise<T>((resolve, reject) => {
      const rawOpts: PromptOpts<T> = {
        ...options,
        customInputComponent: options.customInputComponent
          ? (markRaw(options.customInputComponent) as CustomInputComponent<T>)
          : undefined,
      }

      POPUPS.value.push({
        type: 'prompt',
        id,
        options: rawOpts,
        resolve,
        reject: () => reject(new UserAbortError()),
      })
    }).finally(() => cleanup(id))
  }

  /**
   * Show custom select dialog.
   * @param options Options
   * @returns Promise, which resolves if user selects an options and rejects with a {@link UserAbortError} if user closes the dialog.
   */
  function select<T>(options: SelectOpts<T>): Promise<T> {
    const id = Symbol('select')
    return new Promise<T>((resolve, reject) => {
      POPUPS.value.push({
        type: 'select',
        id,
        options,
        resolve,
        reject: () => reject(new UserAbortError()),
      })
    }).finally(() => cleanup(id))
  }

  /**
   * Cleanup popup from store
   * @param id ID of popup
   */
  function cleanup(id: symbol) {
    // remove after timeout to make sure it is done with animations
    setTimeout(() => {
      POPUPS.value = POPUPS.value.filter((x) => x.id !== id)
    }, 1000)
  }

  return {
    alert,
    confirm,
    prompt,
    select,
    popups: readonly(POPUPS),
  }
}
