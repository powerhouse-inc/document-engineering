import { useCallback, useState } from 'react'

interface UseControllableStateProps<T> {
  value?: T
  defaultValue?: T
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function useControllableState<T>({ value, defaultValue, onChange }: UseControllableStateProps<T>) {
  const [internal, setInternal] = useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(event.target.value as T)
      onChange?.(event)
    },
    [isControlled, onChange]
  )

  return [isControlled ? value : internal, handleChange] as const
}

export default useControllableState
