import type { ColumnType, SortFn } from '../../types.js'

const defaultSortNumberFn = (a: unknown, b: unknown) => {
  if (a === null && b === null) {
    return 0
  }
  if (a === null) {
    return 1
  }
  if (b === null) {
    return -1
  }
  return Number(a) - Number(b)
}

const defaultSortTextFn = (a: unknown, b: unknown) => {
  if (a === null && b === null) {
    return 0
  }
  if (a === null) {
    return 1
  }
  if (b === null) {
    return -1
  }
  return (a as string).localeCompare(b as string)
}

export const defaultSortFns = <T = unknown>(columnType: ColumnType): SortFn<T> => {
  switch (columnType) {
    case 'number':
      return defaultSortNumberFn as SortFn<T>

    case 'boolean':
    case 'string':
    default:
      return defaultSortTextFn as SortFn<T>
  }
}
