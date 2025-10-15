import type { CellContext, DataType } from '../../table/types.js'

/**
 * Default onSave function for table cells.
 *
 * @param value The new value to save
 * @param context The cell context containing row data, column info, and table config
 * @returns Always returns true indicating the save was successful (though no actual persistence occurs)
 */
const defaultCellOnSave = <TData extends DataType = DataType, TCellValue = unknown>(
  value: TCellValue,
  context: CellContext<TData>
): boolean => {
  if (import.meta.env.DEV) {
    // This is a warning that is only shown in development mode for better DX
    // eslint-disable-next-line no-console
    console.warn(`onSave is not implemented for column %c${context.column.field}`, 'font-weight: bold')

    context.tableConfig.data[context.rowIndex][context.column.field as keyof TData] = value as TData[keyof TData]
  }

  return true
}

export { defaultCellOnSave }
