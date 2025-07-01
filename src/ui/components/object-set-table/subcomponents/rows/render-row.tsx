import { useCallback } from 'react'
import type { DataType } from '../../types.js'
import { RowNumberCell } from '../cells/row-number-cell.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { TableRow } from './table-row.js'
import { RenderCell } from '../cells/render-cell/render-cell.js'
import { InformationCell } from '../cells/information-cell.js'

interface RenderRowProps<T extends DataType> {
  item: T
  rowIndex: number
  emptyRow?: boolean
}

const RenderRow = <T extends DataType>({ item, rowIndex, emptyRow = false }: RenderRowProps<T>) => {
  const {
    config,
    state: { selectedRowIndexes, selectedCellIndex },
    api,
  } = useInternalTableState<T>()

  const { allowRowSelection } = config

  /**
   * Create a handler for the click event on the table numbering cell
   * This handler is used to select a row when the ctrl key is pressed
   * or select single rows when the index is clicked
   */
  const createSelectRowOnClickHandler = useCallback(
    (index: number) => (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (!allowRowSelection) return
      if (e.ctrlKey || e.metaKey) {
        e.stopPropagation()
        api.selection.toggleRow(index)
      } else if (e.shiftKey) {
        return // just let the row handle it
      } else {
        api.selection.selectRow(index)
      }
    },
    [allowRowSelection, api.selection]
  )

  /**
   * Create a handler for the click event on the table row
   * This handler is used to select a row when the ctrl key is pressed
   * in any other place other than the index cell or select a range of rows
   * when the shift key is pressed
   */
  const createAddSelectedRowHandler = useCallback(
    (index: number) => (e: React.MouseEvent<HTMLTableRowElement>) => {
      if (!allowRowSelection) return

      if (e.ctrlKey || e.metaKey) {
        api.selection.toggleRow(index)
      } else if (e.shiftKey) {
        // Prevent text selection when shift key is pressed
        document.getSelection()?.removeAllRanges()
        api.selection.selectFromLastActiveRow(index)
      }
    },
    [allowRowSelection, api.selection]
  )

  /**
   * Prevent text selection when shift key is pressed so that we
   * can select a range of rows while keeping a good user experience
   */
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLTableRowElement>) => {
    if (event.shiftKey) {
      document.getSelection()?.removeAllRanges()
    }
  }, [])

  return (
    <TableRow index={rowIndex} onClick={createAddSelectedRowHandler(rowIndex)} onMouseDown={handleMouseDown}>
      {/* The row number cell handles internally if it needs to be rendered or not */}
      <RowNumberCell
        index={rowIndex + 1}
        handleSelectRowOnClick={createSelectRowOnClickHandler(rowIndex)}
        selected={selectedRowIndexes.includes(rowIndex) || selectedCellIndex?.row === rowIndex}
      />

      {/* render the cells */}
      {config.columns.map((column, columnIndex) => {
        return (
          <RenderCell
            key={column.field}
            rowItem={item}
            column={column}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            renderEmptyCell={emptyRow}
          />
        )
      })}

      {(api.isEditable() || api.canDelete()) && <InformationCell rowIndex={rowIndex} emptyRow={emptyRow} />}
    </TableRow>
  )
}

export { RenderRow }
