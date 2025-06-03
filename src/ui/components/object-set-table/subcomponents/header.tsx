import { type FC, useCallback } from 'react'
import { cn } from '../../../../scalars/lib/utils.js'
import type { CellContext, ColumnDef } from '../types.js'
import { getColumnTitle } from '../utils.js'
import { HeaderNumberTd } from './header/header-number-td.js'
import { useInternalTableState } from './table-provider/table-provider.js'

interface TableHeaderProps {
  columns: ColumnDef[]
}

const TableHeader: FC<TableHeaderProps> = ({ columns }) => {
  const {
    config,
    state: { selectedRowIndexes },
    api,
  } = useInternalTableState()

  const handleSelectAllRows = useCallback(() => {
    if (!config.allowRowSelection) return

    api.selection.toggleSelectAll()
  }, [config.allowRowSelection, api.selection])

  const isAllRowsSelected = selectedRowIndexes.length === config.data.length

  return (
    <thead>
      <tr className={cn('border-gray-300', !selectedRowIndexes.includes(0) && 'border-b')}>
        <HeaderNumberTd isAllRowsSelected={isAllRowsSelected} handleSelectAllRows={handleSelectAllRows} />
        {columns.map((column, columnIndex) => {
          const cellContext: CellContext<unknown> = {
            rowIndex: -1, // the header row has no row
            row: undefined,
            column,
            columnIndex,
            tableConfig: config,
          }

          const style: React.CSSProperties = {
            width: column.width ?? 'auto',
            minWidth: column.minWidth ?? 'auto',
            maxWidth: column.maxWidth ?? column.width ?? 'auto',
          }

          return (
            <th style={style} key={column.field}>
              {/* the `renderHeader` function should be intialized with a default value at this point */}
              {column.renderHeader!(getColumnTitle(column), cellContext)}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

export { TableHeader }
