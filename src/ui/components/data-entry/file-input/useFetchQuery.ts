import { useEffect, useState } from 'react'

interface UseQueryOptions {
  enabled?: boolean
}

interface UseQueryResult<T> {
  data: T | null
  isLoading: boolean
  error: unknown
}

const useFetchQuery = <T>(queryFn: () => Promise<T>, { enabled = true }: UseQueryOptions = {}): UseQueryResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      setData(null)

      try {
        const result = await queryFn()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [queryFn, enabled])

  return { data, isLoading, error }
}

export default useFetchQuery
