import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useId } from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useUniqueId = () => {
  return useId()
}
