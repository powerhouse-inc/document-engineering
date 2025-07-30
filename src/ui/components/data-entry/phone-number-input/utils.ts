import type React from 'react'

export const createSyntheticChangeEvent = <T>(value: T) => {
  const syntheticEvent = new Event('change', { bubbles: true, cancelable: true })

  Object.defineProperty(syntheticEvent, 'target', {
    value: { value },

    writable: false,
  })

  return syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>
}
