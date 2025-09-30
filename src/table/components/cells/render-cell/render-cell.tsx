import type { ColumnDef, DataType, IndexedData } from '../../../table/types.js'
import { DefaultTableCell } from '../default-cell.js'
import { Form } from '../../../../scalars/components/form/form.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { EmptyCell } from './empty-cell.js'
import { useCellLogic } from './use-cell-logic.js'

interface RenderCellProps<T extends DataType> {
  rowItem: IndexedData<T>
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
    isThisCellSelected,
    isThisCellEditMode,
    handleCellClick,
    formRef,
    hasErrors,
    cellContext,
    cellValue,
    isAddingRow,
  } = useCellLogic<T>({
    rowItem,
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

  return (
    <DefaultTableCell
      key={column.field}
      onClick={handleCellClick}
      isSelected={isThisCellSelected}
      isEditable={(column.editable ?? false) || (isAddingRow && !!column.renderCellEditor)}
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
