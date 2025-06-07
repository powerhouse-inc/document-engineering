import { useCallback } from 'react'
import { Input } from '../../../data-entry/input/index.js'
import type { CellContext, ColumnDef, DataType } from '../../types.js'
import { isCellEqual } from '../../utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { DefaultTableCell } from './default-cell.js'

interface RenderCellProps<T extends DataType> {
  rowItem: T
  column: ColumnDef<T>
  rowIndex: number
  columnIndex: number
  renderEmptyCell?: boolean
}

const RenderCell = <T extends DataType>({
  rowItem,
  column,
  rowIndex,
  columnIndex,
  renderEmptyCell = false,
}: RenderCellProps<T>) => {
  const {
    config,
    state: { dispatch, selectedCellIndex, isCellEditMode },
    api,
  } = useInternalTableState<T>()

  /**
   * Create a handler for the click event on the table cell
   * This handler is used to enter cell edit mode or select a cell
   */
  const createCellClickHandler = useCallback(
    (index: number, column: number, columnDef: ColumnDef<T>) => (e: React.MouseEvent<HTMLTableCellElement>) => {
      // if the cell is being edited, ignore clicking on it
      if (isCellEditMode && selectedCellIndex?.row === index && selectedCellIndex.column === column) {
        return
      }

      // if shift or ctrl is pressed, the user is probably trying to select rows
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (e.detail === 2 && columnDef.editable) {
          // TODO: move this to the api
          dispatch?.({
            type: 'ENTER_CELL_EDIT_MODE',
            payload: { row: index, column },
          })
        } else {
          api.selection.selectCell(index, column)
        }
      }
    },
    [dispatch, isCellEditMode]
  )

  const currentCellIndex = {
    row: rowIndex,
    column: columnIndex,
  }
  const isThisCellSelected = isCellEqual(selectedCellIndex, currentCellIndex)

  /**
   * If the cell is empty, we don't want to render anything
   * so we're going to return a default table cell with no content
   */
  if (renderEmptyCell) {
    return (
      <DefaultTableCell
        key={column.field}
        onClick={createCellClickHandler(rowIndex, columnIndex, column)}
        isSelected={isThisCellSelected}
        isEditable={false}
      />
    )
  }

  const cellContext: CellContext<T> = {
    row: rowItem,
    column,
    rowIndex,
    columnIndex,
    tableConfig: config,
  }

  // get and format the cell value
  const cellValue = column.valueFormatter?.(column.valueGetter?.(rowItem, cellContext), cellContext)

  const isThisCellEditMode = isCellEditMode && isThisCellSelected

  return (
    <DefaultTableCell
      key={column.field}
      onClick={createCellClickHandler(rowIndex, columnIndex, column)}
      isSelected={isThisCellSelected}
      isEditable={column.editable ?? false}
    >
      {isThisCellEditMode ? (
        <Input
          className="max-w-full"
          autoFocus
          defaultValue={column.valueGetter?.(rowItem, cellContext) as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const newValue = (e.target as HTMLInputElement).value
              column.onSave?.(newValue, cellContext)
            }
          }}
        />
      ) : (
        column.renderCell?.(cellValue, cellContext)
      )}
    </DefaultTableCell>
  )
}

export { RenderCell }
