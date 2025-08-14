import type { CellContext, ColumnDef, DataType } from '../../../table/types.js'
import { DefaultTableCell } from '../default-cell.js'
import { Form } from '../../../../scalars/components/form/form.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { EmptyCell } from './empty-cell.js'
import { useCellLogic } from './use-cell-logic.js'

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
  const { config, isThisCellSelected, isCellEditMode, handleCellClick, formRef, hasErrors } = useCellLogic({
    column,
    rowIndex,
    columnIndex,
    renderEmptyCell,
  })

  /**
   * If the cell is empty, we don't want to render anything
   * so we're going to return a default table cell with no content
   */
  if (renderEmptyCell) {
    return <EmptyCell column={column} isSelected={isThisCellSelected} onClick={handleCellClick} />
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
      onClick={handleCellClick}
      isSelected={isThisCellSelected}
      isEditable={column.editable ?? false}
      isEditing={isThisCellEditMode}
      hasErrors={hasErrors}
    >
      <Form
        ref={formRef}
        onSubmit={() => undefined}
        submitChangesOnly
        extraFormProps={{ mode: 'all', shouldUnregister: true }}
      >
        <div
          className={cn(
            { hidden: !isThisCellEditMode },
            // errors and warnings messages
            '[&_[data-type="error"]]:hidden [&_[data-type="warning"]]:hidden',
            // character counter
            '[&_[data-type="character-counter"]]:hidden'
          )}
        >
          {column.renderCellEditor?.(cellValue, () => null, cellContext)}
        </div>
        <div className={cn({ hidden: isThisCellEditMode })}>{column.renderCell?.(cellValue, cellContext)}</div>
      </Form>
    </DefaultTableCell>
  )
}

export { RenderCell }
