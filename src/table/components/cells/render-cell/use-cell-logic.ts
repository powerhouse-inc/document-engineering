import { useMemo } from 'react'
import type { CellContext, ColumnDef, DataType, IndexedData } from '../../../table/types.js'
import { isCellEqual } from '../../../table/utils.js'
import { useInternalTableState } from '../../table-provider/table-provider.js'

interface UseCellLogicProps<T extends DataType> {
  rowItem: IndexedData<T>
  column: ColumnDef<T>
  rowIndex: number
  columnIndex: number
  renderEmptyCell?: boolean
}
const useCellLogic = <T extends DataType>({
  rowItem,
  column,
  rowIndex,
  columnIndex,
  renderEmptyCell = false,
}: UseCellLogicProps<T>) => {
  const {
    config,
    state: { selectedCellIndex, isCellEditMode, selectedRowErrors },
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
          void api.exitCellEditMode(true).then(() => {
            api.selection.selectCell(rowIndex, columnIndex)
          })
          return
        }

        if (event.detail === 2 && api.canEditCell(rowIndex, columnIndex) && !renderEmptyCell) {
          api.enterCellEditMode(rowIndex, columnIndex)
        } else {
          api.selection.selectCell(rowIndex, columnIndex)
        }
      }
    }

    return handler
  }, [api, selectedCellIndex, rowIndex, columnIndex, renderEmptyCell])

  const formRef = renderEmptyCell ? null : api._getState().dataFormReferences[rowIndex]?.[columnIndex]

  const hasErrors =
    selectedCellIndex?.row === rowIndex && Array.isArray(selectedRowErrors) && selectedRowErrors.length > 0

  const isThisCellEditMode = isCellEditMode && isThisCellSelected

  const cellContext: CellContext<T> = useMemo(
    () => ({
      row: rowItem.data,
      column,
      rowIndex,
      columnIndex,
      tableConfig: config,
      isEditMode: isThisCellEditMode,
    }),
    [rowItem.data, column, rowIndex, columnIndex, config, isThisCellEditMode]
  )

  // get and format the cell value
  const cellValue = useMemo(() => {
    return rowIndex < config.data.length
      ? column.valueFormatter?.(column.valueGetter?.(rowItem.data, cellContext), cellContext)
      : undefined
  }, [rowIndex, config.data.length, column, rowItem.data, cellContext])

  const isAddingRow = rowIndex === config.data.length

  return {
    config,
    isThisCellSelected,
    isCellEditMode,
    isThisCellEditMode,
    handleCellClick,
    formRef,
    hasErrors,
    cellContext,
    cellValue,
    isAddingRow,
  }
}

export { useCellLogic }
