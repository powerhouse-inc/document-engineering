import { useCallback, useMemo } from 'react'
import { cn } from '../../scalars/lib/utils.js'
import type { CellContext, ColumnDef } from '../table/types.js'
import { getColumnTitle } from '../table/utils.js'
import { HeaderNumberTd } from './header/header-number-td.js'
import { useInternalTableState } from './table-provider/table-provider.js'
import { useRowDrag } from '../hooks/useRowDrag.js'

interface TableHeaderProps {
  columns: Array<ColumnDef<any>>
}

const HEADER_ROW_INDEX = -1

const TableHeader = ({ columns }: TableHeaderProps) => {
  const {
    config,
    state: { selectedRowIndexes },
    api,
  } = useInternalTableState()

  const handleSelectAllRows = useCallback(() => {
    if (!config.allowRowSelection) return

    api.selection.toggleSelectAll()
  }, [config.allowRowSelection, api.selection])

  const isAllRowsSelected = api.getTotalRowsCount() !== 0 && selectedRowIndexes.length === api.getTotalRowsCount()

  const columnHeaders = useMemo(() => {
    return columns.map((column, columnIndex) => {
      const cellContext: CellContext<any> = {
        rowIndex: -1, // the header row has no row
        row: undefined,
        column,
        columnIndex,
        tableConfig: config,
        isEditMode: false,
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
          void api.sortRows(columnIndex, nextDirection)
        } else {
          void api.sortRows(columnIndex, 'asc')
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

  const { draggingOver, onDragOver, onDragLeave, onDrop } = useRowDrag(HEADER_ROW_INDEX)

  return (
    <thead>
      <tr
        className={cn(
          !selectedRowIndexes.includes(0) && 'border-b',
          draggingOver ? 'border-b-1 border-blue-500' : 'border-gray-300'
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <HeaderNumberTd isAllRowsSelected={isAllRowsSelected} handleSelectAllRows={handleSelectAllRows} />
        {columnHeaders}
      </tr>
    </thead>
  )
}

export { TableHeader }
