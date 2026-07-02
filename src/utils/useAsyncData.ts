import { useCallback, useEffect, useRef, useState } from 'react'

export interface AsyncDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useAsyncData<T>(loadFn: () => Promise<T>, deps: unknown[]): AsyncDataState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadTick, setReloadTick] = useState(0)

  const loadFnRef = useRef(loadFn)
  loadFnRef.current = loadFn

  const reload = useCallback(() => setReloadTick((tick) => tick + 1), [])

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    loadFnRef.current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load content')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [...deps, reloadTick])

  return { data, loading, error, reload }
}
