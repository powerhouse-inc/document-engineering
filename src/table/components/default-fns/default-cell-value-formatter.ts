import type { CellContext, DataType } from '../../table/types.js'

const defaultValueFormatter = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  if (value === null || value === undefined) {
    return ''
  }

  // For amount type, preserve objects and numbers
  if (context.column.type === 'amount') {
    if (typeof value === 'object' || typeof value === 'number') {
      return value
    }
  }

  // For other values, convert to string
  return String(value)
}

export { defaultValueFormatter }
