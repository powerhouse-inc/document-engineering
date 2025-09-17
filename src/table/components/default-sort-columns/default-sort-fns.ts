import type { ColumnType, SortFn } from '../../table/types.js'

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
    case 'amount':
      return defaultSortNumberFn as SortFn<T>

    case 'boolean':
    case 'string':
    case 'country':
    case 'enum':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'time':
    case 'url':
    case 'email':
    case 'phid':
    case 'oid':
    case 'aid':
    case 'phone':
    default:
      return defaultSortTextFn as SortFn<T>
  }
}
