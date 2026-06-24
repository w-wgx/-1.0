import { ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(initial: T, delay = 300) {
  const state = ref(initial) as Ref<T>
  const debounced = ref(initial) as Ref<T>
  let timer: number | null = null

  watch(state, (val) => {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  return [state, debounced] as const
}