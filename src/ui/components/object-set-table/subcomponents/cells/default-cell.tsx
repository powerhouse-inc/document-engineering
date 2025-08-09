import { cn } from '../../../../../scalars/lib/utils.js'
import { TableCellBasic } from './basic-cell.js'

interface DefaultTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  isSelected: boolean
  isEditable: boolean
  isEditing?: boolean
  hasErrors?: boolean
}

const DefaultTableCell: React.FC<DefaultTableCellProps> = ({
  children,
  className,
  isSelected,
  isEditable,
  isEditing = false,
  hasErrors = false,
  ...props
}) => {
  return (
    <TableCellBasic tabIndex={0} {...props} className={cn(className, 'py-0 focus:outline-none')}>
      <div
        className={cn(
          'flex flex-1 items-center border border-transparent',
          !isEditing && 'py-2',
          isSelected && (isEditable ? (hasErrors ? 'border-red-900' : 'border-blue-900') : 'border-gray-400')
        )}
      >
        <div className="w-full px-[12px] py-2">{children}</div>
      </div>
    </TableCellBasic>
  )
}

export { DefaultTableCell }
