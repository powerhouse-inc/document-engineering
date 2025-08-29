import { useCallback, useMemo, useRef, useState } from 'react'
import type { DataType, IndexedData } from '../../table/types.js'
import { RowNumberCell } from '../cells/row-number-cell.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { TableRow } from './table-row.js'
import { RenderCell } from '../cells/render-cell/render-cell.js'
import { InformationCell } from '../cells/information-cell.js'
import { RowActions } from './row-actions.js'
import { useRowDrag } from '../../hooks/useRowDrag.js'
import { cn } from '../../../scalars/index.js'

interface RenderRowProps<T extends DataType> {
  item: IndexedData<T>
  rowIndex: number
  mode?: 'default' | 'inserting' | 'empty'
}

const RenderRow = <T extends DataType>({ item, rowIndex, mode = 'default' }: RenderRowProps<T>) => {
  const {
    config,
    state: { selectedRowIndexes, selectedCellIndex, selectedRowErrors },
    api,
  } = useInternalTableState<T>()

  const { allowRowSelection } = config

  /**
   * Create a handler for the click event on the table numbering cell
   * This handler is used to select a row when the ctrl key is pressed
   * or select single rows when the index is clicked
   */
  const createSelectRowOnClickHandler = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (!allowRowSelection) return
      if (event.ctrlKey || event.metaKey) {
        event.stopPropagation()
        api.selection.toggleRow(index)
      } else if (event.shiftKey) {
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
    (index: number) => (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (!allowRowSelection) return

      if (event.ctrlKey || event.metaKey) {
        api.selection.toggleRow(index)
      } else if (event.shiftKey) {
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

  const rowRef = useRef<HTMLTableRowElement>(null)

  // actions state management
  const canShowActions = useMemo(() => {
    if (selectedCellIndex?.row === rowIndex && Array.isArray(selectedRowErrors) && selectedRowErrors.length > 0) {
      // we can not show the actions if a field is being edited and has errors
      return false
    }
    return (
      mode === 'default' &&
      (!!api.canDelete() ||
        config.actions?.primary ||
        (Array.isArray(config.actions?.secondary) && config.actions.secondary.length > 0))
    )
  }, [
    selectedCellIndex?.row,
    rowIndex,
    selectedRowErrors,
    mode,
    api,
    config.actions?.primary,
    config.actions?.secondary,
  ])

  const hasErrors =
    selectedCellIndex?.row === rowIndex && Array.isArray(selectedRowErrors) && selectedRowErrors.length > 0

  const [actionsOpen, setActionsOpen] = useState(false)
  const [isSecondaryActionsOpen, setIsSecondaryActionsOpen] = useState(false)
  const handleRowMouseEnter = useCallback(() => {
    setActionsOpen(true)
  }, [])
  const handleRowMouseLeave = useCallback(() => {
    setActionsOpen(false)
  }, [])
  const handleSecondaryActionsOpen = useCallback(() => {
    setIsSecondaryActionsOpen(true)
  }, [])
  const handleSecondaryActionsClose = useCallback(() => {
    setIsSecondaryActionsOpen(false)
  }, [])

  const { canDrag, draggingOver, ...eventHandlers } = useRowDrag(rowIndex)

  return (
    <TableRow
      ref={rowRef}
      index={rowIndex}
      onClick={createAddSelectedRowHandler(rowIndex)}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleRowMouseEnter}
      onMouseLeave={handleRowMouseLeave}
      // rows drag and drop handlers
      draggable={canDrag}
      {...eventHandlers}
      className={cn(draggingOver === rowIndex && canDrag && 'border-b-1 border-blue-900')}
    >
      {/* The row number cell handles internally if it needs to be rendered or not */}
      <RowNumberCell
        index={mode === 'default' ? item.__index + 1 : rowIndex + 1}
        handleSelectRowOnClick={createSelectRowOnClickHandler(rowIndex)}
        selected={selectedRowIndexes.includes(rowIndex) || selectedCellIndex?.row === rowIndex}
        hasErrors={hasErrors}
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
            renderEmptyCell={mode === 'empty'}
          />
        )
      })}

      {(api.isEditable() || api.canDelete()) && <InformationCell rowIndex={rowIndex} />}

      {canShowActions && (
        <RowActions
          data={item}
          open={actionsOpen}
          rowIndex={rowIndex}
          rowRef={rowRef}
          primaryAction={config.actions?.primary}
          secondaryActions={config.actions?.secondary}
          isSecondaryActionsOpen={isSecondaryActionsOpen}
          handleSecondaryActionsOpen={handleSecondaryActionsOpen}
          handleSecondaryActionsClose={handleSecondaryActionsClose}
        />
      )}
    </TableRow>
  )
}

export { RenderRow }
