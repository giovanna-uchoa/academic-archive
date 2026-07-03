import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from './errors'

export interface AsyncDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAsyncData<T>(loadFn: () => Promise<T>, deps: unknown[]): AsyncDataState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFnRef = useRef(loadFn)
  loadFnRef.current = loadFn

  // Guards against overlapping calls to `reload()` on a hook whose deps never
  // change (nothing else would stop two manual reloads racing each other).
  const loadingRef = useRef(false)
  // Guards against a load started for a since-superseded `deps` value (e.g.
  // fast subject-to-subject navigation) landing after a newer one already resolved.
  const epochRef = useRef(0)

  const load = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    const epoch = epochRef.current

    setLoading(true)
    setError(null)

    try {
      const result = await loadFnRef.current()
      if (epochRef.current === epoch) setData(result)
    } catch (err) {
      if (epochRef.current === epoch) setError(getErrorMessage(err, 'Failed to load content'))
    } finally {
      if (epochRef.current === epoch) setLoading(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    void load()

    return () => {
      epochRef.current += 1
      loadingRef.current = false
    }
  }, deps)

  return { data, loading, error, reload: load }
}
