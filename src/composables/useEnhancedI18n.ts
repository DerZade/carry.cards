import { useI18n, type NamedValue } from 'vue-i18n'

export type TranslationItem = string | { path: string; args?: NamedValue; plural?: number }

/**
 * Wrapper around `vue-i18n`s {@link useI18n}, but with a `t` function that
 * can handle a single object parameter.
 *
 * This is useful in cases where a generic component should have prop that
 * is used for a label for example, and that label can be a "advanced"
 * translated value and not only a string, meaning it can have named value
 * substitution or pluralized values.
 *
 * @returns Same as {@link useI18n}, but with a overloaded `t` function
 */
export function useEnhancedI18n() {
  const ret = useI18n({ useScope: 'global' })

  function t(val: TranslationItem) {
    if (typeof val === 'string') return ret.t(val)

    const { path, args, plural } = val

    if (args !== undefined && plural !== undefined) return ret.t(path, args, plural)

    if (args !== undefined && plural === undefined) return ret.t(path, args)

    if (args === undefined && plural !== undefined) return ret.t(path, plural)

    return ret.t(path)
  }

  return {
    ...ret,
    t,
  }
}
