import { useEffect } from 'react'
import { useInternalTableState } from '../subcomponents/table-provider/table-provider.js'
import { getDirectionFromKey, getNextSelectedCell } from '../utils.js'

const useGlobalTableKeyEvents = () => {
  const { api } = useInternalTableState()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = api.isEditing()
      const selectedCell = api._getState().selectedCellIndex

      if (isEditing) {
        if (e.key === 'Enter') {
          api.exitCellEditMode(true)
        }
        if (e.key === 'Escape' && !!selectedCell) {
          api.exitCellEditMode(false)
        }
      } else {
        if (e.key === 'Enter' && !!selectedCell && api.canEditCell(selectedCell.row, selectedCell.column)) {
          // prevent the form from being submitted when the cell enters in edit mode
          e.preventDefault()
          api.enterCellEditMode(selectedCell.row, selectedCell.column)
        }

        // arrow keys
        if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Tab'].includes(e.key)) {
          const direction = getDirectionFromKey(e.key)
          const nextCell = getNextSelectedCell({
            direction,
            currentCell: selectedCell,
            rowCount: api._getState().data.length,
            columnCount: api._getConfig().columns.length,
            moveToNextRow: e.key === 'Tab',
          })
          if (e.key === 'Tab') {
            e.preventDefault()
          }
          api.selection.selectCell(nextCell.row, nextCell.column)
        }
      }
    }

    api.getHTMLTable()?.addEventListener('keydown', handleKeyDown)
    return () => {
      api.getHTMLTable()?.removeEventListener('keydown', handleKeyDown)
    }
  }, [api])
}

export { useGlobalTableKeyEvents }
