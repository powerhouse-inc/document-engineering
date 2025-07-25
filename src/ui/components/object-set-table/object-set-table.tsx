import { useMemo, useRef } from 'react'
import { TableBody } from './subcomponents/body.js'
import { getRenderFn } from './subcomponents/default-cell-renderers/get-render-fn.js'
import { defaultValueFormatter } from './subcomponents/default-fns/default-cell-value-formatter.js'
import { defaultValueGetter } from './subcomponents/default-fns/default-cell-value-getter.js'
import { TableHeader } from './subcomponents/header.js'
import { TableFocusTrap } from './subcomponents/table-focus-trap.js'
import { TableProvider } from './subcomponents/table-provider/table-provider.js'
import type { ColumnType, DataType, ObjectSetTableConfig } from './types.js'
import { defaultColumnAlignment } from './subcomponents/default-fns/default-column-config.js'
import { defaultHeaderRenderer } from './subcomponents/default-header-renderers/default-header-renderer.js'
import { defaultSortFns } from './subcomponents/default-sort-columns/default-sort-fns.js'
import { getCellEditorFn } from './subcomponents/default-cell-editors/get-cell-editor-fn.js'

/**
 * The ObjectSetTable component is a table component that displays a list of objects.
 *
 * @param columns The columns to display in the table.
 * @param data The data to display in the table.
 * @param allowRowSelection Whether to allow row selection.
 * @param showRowNumbers Whether to show row numbers.
 * @param onAdd Function called when a new row is added. Enables insertion row when provided.
 * @param onDelete Function called when rows are deleted. Enables deletion functionality when provided.
 * @param apiRef Reference to the table API for programmatic control.
 */
const ObjectSetTable = <T extends DataType = DataType>(config: ObjectSetTableConfig<T>) => {
  /**
   * Extend the config with default values in case they are not provided
   */
  const extendedConfig = useMemo(() => {
    const defaultColumnType: ColumnType = 'string'
    const _config: ObjectSetTableConfig<T> = {
      ...config,
      columns: config.columns.map((column) => ({
        ...column,
        align: column.align ?? defaultColumnAlignment(column.type ?? defaultColumnType),
        type: column.type ?? defaultColumnType,
        valueGetter: column.valueGetter ?? defaultValueGetter,
        valueFormatter: column.valueFormatter ?? defaultValueFormatter,
        renderHeader: column.renderHeader ?? defaultHeaderRenderer,
        renderCell: column.renderCell ?? getRenderFn(column.type),
        editable: column.editable ?? false,
        // TODO: move the default onSave to a utility function
        onSave:
          column.onSave ??
          ((value, context) => {
            if (import.meta.env.DEV) {
              // This is a warning that is only shown in development mode for better DX
              // eslint-disable-next-line no-console
              console.warn(`onSave is not implemented for column %c${column.field}`, 'font-weight: bold')
            }
            config.data[context.rowIndex][context.column.field as keyof T] = value as T[keyof T]
            return true
          }),
        renderCellEditor: column.renderCellEditor ?? getCellEditorFn(column.type),
        // sorting
        sortable: column.sortable ?? false,
        rowComparator: column.rowComparator ?? defaultSortFns(column.type ?? defaultColumnType),
      })),
      width: config.width ?? 'auto',
      minRowCount: config.minRowCount ?? 0,
      minRowHeight: config.minRowHeight ?? 'auto',
      allowRowSelection: config.allowRowSelection ?? true,
      showRowNumbers: config.showRowNumbers ?? true,
      apiRef: config.apiRef,
    }

    return _config
  }, [config])

  const tableRef = useRef<HTMLTableElement>(null)

  return (
    <TableProvider config={extendedConfig} tableRef={tableRef}>
      <TableFocusTrap>
        <div className="grid grid-cols-1 overflow-x-auto rounded-md border border-gray-300">
          <table className="object-set-table" ref={tableRef} style={{ minWidth: config.width }}>
            <TableHeader columns={extendedConfig.columns} />
            <TableBody />
          </table>
        </div>
      </TableFocusTrap>
    </TableProvider>
  )
}

export { ObjectSetTable }
