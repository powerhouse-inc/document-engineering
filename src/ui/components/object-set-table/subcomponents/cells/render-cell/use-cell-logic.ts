import { useMemo } from 'react'
import type { ColumnDef, DataType } from '../../../types.js'
import { isCellEqual } from '../../../utils.js'
import { useInternalTableState } from '../../table-provider/table-provider.js'

interface UseCellLogicProps<T extends DataType> {
  column: ColumnDef<T>
  rowIndex: number
  columnIndex: number
  renderEmptyCell?: boolean
}
const useCellLogic = <T extends DataType>({
  column,
  rowIndex,
  columnIndex,
  renderEmptyCell = false,
}: UseCellLogicProps<T>) => {
  const {
    config,
    state: { selectedCellIndex, isCellEditMode },
    api,
  } = useInternalTableState<T>()

  const currentCellIndex = {
    row: rowIndex,
    column: columnIndex,
  }
  const isThisCellSelected = isCellEqual(selectedCellIndex, currentCellIndex)

  const handleCellClick = useMemo(() => {
    const handler = (event: React.MouseEvent<HTMLTableCellElement>) => {
      // if the cell is being edited, ignore clicking on it
      if (api.isEditing() && selectedCellIndex?.row === rowIndex && selectedCellIndex.column === columnIndex) {
        return
      }

      // if shift, cmd or ctrl is pressed, the user is probably trying to select rows
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        // if a cell is being edited but the cell being clicked is not the same
        // we need to save it before exiting edit mode and selecting a new cell
        if (api.isEditing()) {
          void api.exitCellEditMode(true)
        }

        if (event.detail === 2 && column.editable && !renderEmptyCell) {
          api.enterCellEditMode(rowIndex, columnIndex)
        } else {
          api.selection.selectCell(rowIndex, columnIndex)
        }
      }
    }

    return handler
  }, [api, selectedCellIndex, rowIndex, columnIndex, column.editable, renderEmptyCell])

  const formRef = renderEmptyCell ? null : api._getState().dataFormReferences[rowIndex]?.[columnIndex]

  return {
    config,
    isThisCellSelected,
    isCellEditMode,
    handleCellClick,
    formRef,
  }
}

export { useCellLogic }
