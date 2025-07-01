import type { ColumnDef, DataType } from '../../../types.js'
import { DefaultTableCell } from '../default-cell.js'

interface EmptyCellProps<T> {
  column: ColumnDef<T>
  isSelected: boolean
  onClick: (event: React.MouseEvent<HTMLTableCellElement>) => void
}

const EmptyCell = <T extends DataType>({ column, isSelected, onClick }: EmptyCellProps<T>) => {
  return <DefaultTableCell key={column.field} onClick={onClick} isSelected={isSelected} isEditable={false} />
}

export { EmptyCell }
