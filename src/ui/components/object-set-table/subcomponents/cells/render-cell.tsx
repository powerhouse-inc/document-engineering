import { useCallback } from 'react'
import type { CellContext, ColumnDef, DataType } from '../../types.js'
import { isCellEqual } from '../../utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { DefaultTableCell } from './default-cell.js'
import { Form } from '../../../../../scalars/components/form/form.js'
import { cn } from '../../../../../scalars/lib/utils.js'

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
    state: { selectedCellIndex, isCellEditMode },
    api,
  } = useInternalTableState<T>()

  /**
   * Create a handler for the click event on the table cell
   * This handler is used to enter cell edit mode or select a cell
   */
  const createCellClickHandler = useCallback(
    (index: number, column: number, columnDef: ColumnDef<T>) => (e: React.MouseEvent<HTMLTableCellElement>) => {
      // if the cell is being edited, ignore clicking on it
      if (api.isEditing() && selectedCellIndex?.row === index && selectedCellIndex.column === column) {
        return
      }

      // if shift, cmd or ctrl is pressed, the user is probably trying to select rows
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // if a cell is being edited but the cell being clicked is not the same
        // we need to save it before exiting edit mode and selecting a new cell
        if (api.isEditing()) {
          void api.exitCellEditMode(true)
        }

        if (e.detail === 2 && columnDef.editable && !renderEmptyCell) {
          api.enterCellEditMode(index, column)
        } else {
          api.selection.selectCell(index, column)
        }
      }
    },
    [selectedCellIndex, api, renderEmptyCell]
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

  const formRef = api._getState().dataFormReferences[rowIndex][columnIndex]

  return (
    <DefaultTableCell
      key={column.field}
      onClick={createCellClickHandler(rowIndex, columnIndex, column)}
      isSelected={isThisCellSelected}
      isEditable={column.editable ?? false}
    >
      <Form ref={formRef} onSubmit={() => undefined} submitChangesOnly>
        <div className={cn({ hidden: !isThisCellEditMode })}>
          {column.renderCellEditor?.(cellValue, () => null, cellContext)}
        </div>
        <div className={cn({ hidden: isThisCellEditMode })}>{column.renderCell?.(cellValue, cellContext)}</div>
      </Form>
    </DefaultTableCell>
  )
}

export { RenderCell }
