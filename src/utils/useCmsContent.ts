import { cmsApi } from './cmsApi'
import { useAsyncData } from './useAsyncData'

export function useCmsContent() {
  const { data, loading, error, reload } = useAsyncData(() => cmsApi.listAll(), [])

  return {
    subjects: data?.subjects ?? [],
    posts: data?.posts ?? [],
    tags: data?.tags ?? [],
    tagSummary: data?.tagSummary ?? [],
    loading,
    error,
    reload,
  }
}
