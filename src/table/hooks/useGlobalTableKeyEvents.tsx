import { useEffect } from 'react'
import { useInternalTableState } from '../components/table-provider/table-provider.js'
import { getDirectionFromKey, getNextSelectedCell } from '../table/utils.js'

const useGlobalTableKeyEvents = () => {
  const { api } = useInternalTableState()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = api.isEditing()
      const selectedCell = api._getState().selectedCellIndex

      if (isEditing) {
        if (e.key === 'Enter') {
          void api.exitCellEditMode(true)
        }
        if (e.key === 'Escape' && !!selectedCell) {
          void api.exitCellEditMode(false)
        }
        if (e.key === 'Tab') {
          e.preventDefault()
          void api.getErrors(selectedCell?.row ?? 0, true).then((errors) => {
            if (errors.length > 0) {
              return
            } else {
              void api.exitCellEditMode(true).then(() => {
                if (!selectedCell) return
                const nextCell = getNextSelectedCell({
                  direction: 'right',
                  currentCell: selectedCell,
                  rowCount: api._getState().data.length,
                  columnCount: api._getConfig().columns.length,
                  moveToNextRow: true,
                  columns: api._getConfig().columns,
                })
                api.selection.selectCell(nextCell.row, nextCell.column)
              })
            }
          })
        }
      } else {
        if (e.key === 'Enter' && !!selectedCell && api.canEditCell(selectedCell.row, selectedCell.column)) {
          // prevent the form from being submitted when the cell enters in edit mode
          e.preventDefault()
          api.enterCellEditMode(selectedCell.row, selectedCell.column)
        }

        // arrow keys
        if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Tab'].includes(e.key)) {
          if (!selectedCell) return
          const direction = getDirectionFromKey(e.key)
          const nextCell = getNextSelectedCell({
            direction,
            currentCell: selectedCell,
            rowCount: api._getState().data.length,
            columnCount: api._getConfig().columns.length,
            moveToNextRow: e.key === 'Tab',
            columns: api._getConfig().columns,
          })
          api.selection.selectCell(nextCell.row, nextCell.column)

          if (e.key === 'Tab') {
            e.preventDefault()
          }
        }
      }
    }

    const handleDeleteRows = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && api.canDelete()) {
        const selectedRowIndexes = api.selection
          .getSelectedRowIndexes()
          // we need to filter out the rows as generated empty rows might be selected
          .filter((index) => index < api._getState().data.length)
        if (selectedRowIndexes.length > 0) {
          void api.deleteRows(selectedRowIndexes)
        }
      }
    }

    api.getHTMLTable()?.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keydown', handleDeleteRows)
    return () => {
      api.getHTMLTable()?.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleDeleteRows)
    }
  }, [api])
}

export { useGlobalTableKeyEvents }
