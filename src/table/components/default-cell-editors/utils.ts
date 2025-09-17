export const normalizeStringValue = (value: unknown): string => {
  return typeof value === 'string' ? value : (value?.toString() ?? '')
}

export const normalizeEnumValue = (value: unknown): string | string[] | undefined => {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value
  }
  return undefined
}

export const normalizeDateValue = (value: unknown): string | Date | undefined => {
  if (typeof value === 'string' || value instanceof Date) {
    return value
  }
  return undefined
}
