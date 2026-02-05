import { ref } from 'vue'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { usePopupSubmit } from './usePopupSubmit'

/**
 * @returns Promise, that resolves to a promise as well as the resolve and reject function for that promise
 */
async function controllablePromise<T = void>() {
  const ret: {
    resolve: (val: T | PromiseLike<T>) => void
    reject: (err: unknown) => void
    promise: Promise<T>
  } = {
    resolve: () => {},
    reject: () => {},
    promise: Promise.resolve() as Promise<T>,
  }

  await new Promise<void>((_resolve) => {
    ret.promise = new Promise<T>((resolve, reject) => {
      ret.resolve = resolve
      ret.reject = reject
      _resolve()
    })
  })

  return ret
}

describe('usePopupSubmit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('can submit with value', async () => {
    const emit = vi.fn()
    const { submit } = usePopupSubmit({}, ref(true), emit)

    await submit('test')

    expect(emit).toBeCalledTimes(1)
    expect(emit).toBeCalledWith('resolve', 'test')
  })

  it('can submit with no value', async () => {
    const emit = vi.fn()
    const { submit } = usePopupSubmit<void>({}, ref(true), emit)

    await submit()

    expect(emit).toBeCalledTimes(1)
    expect(emit).toBeCalledWith('resolve', undefined)
  })

  it('sets loading properly', async () => {
    const { resolve, promise } = await controllablePromise<boolean>()
    const emit = vi.fn()
    const { submit, loading } = usePopupSubmit<void>({ onSubmit: () => promise }, ref(true), emit)

    expect(loading.value).toBe(false)
    const submitPromise = submit()
    expect(loading.value).toBe(true)

    resolve(true)
    await submitPromise
    expect(loading.value).toBe(false)
  })

  it('closes popup upon submission', async () => {
    const visible = ref(true)
    const emit = vi.fn()
    const { submit } = usePopupSubmit<void>({}, visible, emit)

    expect(visible.value).toBe(true)
    expect(emit).toBeCalledTimes(0)

    await submit()

    expect(visible.value).toBe(false)
    expect(emit).toBeCalledTimes(1)
  })

  it('submission can be prevented', async () => {
    const visible = ref(true)
    const emit = vi.fn()
    const onSubmit = vi.fn()
    const { submit } = usePopupSubmit<void>({ onSubmit }, visible, emit)

    expect(visible.value).toBe(true)
    expect(emit).toBeCalledTimes(0)

    // prevent event should cancel submission
    onSubmit.mockImplementationOnce((e) => e.preventDefault())
    await submit()
    expect(visible.value).toBe(true)
    expect(emit).toBeCalledTimes(0)

    // not preventing event should allow submission
    await submit()
    expect(visible.value).toBe(false)
    expect(emit).toBeCalledTimes(1)
  })

  it('can submit (un)-successfully', async () => {
    const visible = ref(true)
    const emit = vi.fn()
    const onSubmit = vi.fn()
    const { submit } = usePopupSubmit<number>({ onSubmit }, visible, emit)

    expect(visible.value).toBe(true)
    expect(emit).toBeCalledTimes(0)

    // onSubmit returning `false` should be considered "unsuccessful"
    onSubmit.mockImplementationOnce(() => false)
    await submit(1337)
    expect(visible.value).toBe(false)
    expect(emit).toBeCalledTimes(1)
    expect(emit).toBeCalledWith('reject')

    emit.mockClear()
    visible.value = true

    // onSubmit returning `true` should be considered "successful"
    onSubmit.mockImplementationOnce(() => true)
    await submit(1337)
    expect(visible.value).toBe(false)
    expect(emit).toBeCalledTimes(1)
    expect(emit).toBeCalledWith('resolve', 1337)

    emit.mockClear()
    visible.value = true

    // onSubmit returning `undefined` should be considered "successful"
    onSubmit.mockImplementationOnce(() => undefined)
    await submit(1337)
    expect(visible.value).toBe(false)
    expect(emit).toBeCalledTimes(1)
    expect(emit).toBeCalledWith('resolve', 1337)
  })
})
