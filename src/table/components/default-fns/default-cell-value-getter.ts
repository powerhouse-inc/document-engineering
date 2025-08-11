import type { CellContext, ValueGetterFn } from '../../table/types.js'
import { getColumnValue } from '../../table/utils.js'

const defaultValueGetter = (<T>(row: T, context: CellContext<T>): unknown => {
  return getColumnValue(row, context.column.field)
}) as ValueGetterFn<any>

export { defaultValueGetter }
