import { type FC, useCallback, useMemo } from 'react'
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

  const isAllRowsSelected = selectedRowIndexes.length === api.getTotalRowsCount()

  const columnHeaders = useMemo(() => {
    return columns.map((column, columnIndex) => {
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

      const onSort = () => {
        if (!column.sortable) return

        const tableState = api._getState()
        if (tableState.sortState?.columnIndex === columnIndex) {
          const nextDirection = tableState.sortState.direction === 'asc' ? 'desc' : null
          api.sortRows(columnIndex, nextDirection)
        } else {
          api.sortRows(columnIndex, 'asc')
        }
      }

      return (
        <th
          className={cn('group/header-cell', column.sortable ? 'cursor-pointer' : '')}
          style={style}
          key={column.field}
          onClick={onSort}
        >
          {/* the `renderHeader` function should be intialized with a default value at this point */}
          {column.renderHeader!(getColumnTitle(column), cellContext)}
        </th>
      )
    })
  }, [api, columns, config])

  return (
    <thead>
      <tr className={cn('border-gray-300', !selectedRowIndexes.includes(0) && 'border-b')}>
        <HeaderNumberTd isAllRowsSelected={isAllRowsSelected} handleSelectAllRows={handleSelectAllRows} />
        {columnHeaders}
      </tr>
    </thead>
  )
}

export { TableHeader }
