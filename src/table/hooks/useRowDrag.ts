import { useCallback, useEffect, useState } from 'react'
import { useInternalTableState } from '../components/table-provider/table-provider.js'

const setData = (event: React.DragEvent<HTMLTableRowElement>, data: number[]) => {
  event.dataTransfer.setData('text/plain', data.toString())
}
const getData = (event: React.DragEvent<HTMLTableRowElement>) => {
  return event.dataTransfer.getData('text/plain').split(',').map(Number)
}

export const useRowDrag = (rowIndex: number) => {
  const {
    api,
    state: { data: rows },
    config: { onReorder },
  } = useInternalTableState()
  const [canDrag, setCanDrag] = useState<boolean>(typeof onReorder === 'function' && rowIndex < rows.length)
  const [draggingOver, setDraggingOver] = useState<number | null>(null)

  useEffect(() => {
    setCanDrag(typeof onReorder === 'function' && rowIndex < rows.length)
  }, [onReorder, rowIndex, rows])

  /**
   * The user started dragging a row
   */
  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      const selectedRowIndexes = api.selection.getSelectedRowIndexes()
      const rowsToDrag = selectedRowIndexes.includes(rowIndex) ? selectedRowIndexes : [rowIndex]
      setData(event, rowsToDrag)
      event.dataTransfer.dropEffect = 'move'

      const selectedRowCount = api.selection.getSelectedRowIndexes().length
      if (selectedRowCount > 1) {
        // Create a small card element to show the number of selected rows
        const dragImage = document.createElement('div')
        dragImage.className = 'pl-4 pt-4'

        const innerDiv = document.createElement('div')
        innerDiv.className =
          'w-fit bg-blue-500 text-white px-3 py-2 rounded-md text-xs font-medium shadow-md pointer-events-none'
        innerDiv.textContent = `${selectedRowCount} rows`

        dragImage.appendChild(innerDiv)

        document.body.appendChild(dragImage)
        event.dataTransfer.setDragImage(dragImage, 0, 0)

        // Clean up the drag image element after a short delay
        setTimeout(() => {
          document.body.removeChild(dragImage)
        }, 0)
      }
    },
    [api.selection, rowIndex]
  )

  /**
   * The user leaved a row while dragging
   */
  const onDragLeave = useCallback((event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault()
    setDraggingOver(null)
  }, [])

  /**
   * The user is dragging a row over a row
   */
  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      event.preventDefault()
      if (rowIndex < api._getConfig().data.length) {
        setDraggingOver(rowIndex) // can not drag over itself
      }
    },
    [api, rowIndex]
  )

  /**
   * The user dropped a row on a row
   */
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLTableRowElement>) => {
      event.preventDefault()
      const draggedRowIndexes = getData(event)

      setDraggingOver(null) // reset dragging over as it fineshed

      const draggedData = draggedRowIndexes.map((index) => rows[index].data)
      void onReorder?.(draggedData, rowIndex)
      api.selection.clear()
    },
    [api, onReorder, rowIndex, rows]
  )

  return {
    canDrag,
    draggingOver,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}
