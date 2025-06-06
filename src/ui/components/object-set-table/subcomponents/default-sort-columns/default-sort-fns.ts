import type { ColumnType, SortFn } from '../../types.js'

const defaultSortNumberFn = (a: unknown, b: unknown) => {
  return Number(a) - Number(b)
}

const defaultSortTextFn = (a: unknown, b: unknown) => {
  return (a as string).localeCompare(b as string)
}

export const defaultSortFns = <T = unknown>(columnType: ColumnType): SortFn<T> => {
  switch (columnType) {
    case 'number':
      return defaultSortNumberFn

    case 'boolean':
    case 'text':
    default:
      return defaultSortTextFn
  }
}
