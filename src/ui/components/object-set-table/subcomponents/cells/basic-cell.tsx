import { cn } from '../../../../../scalars/lib/utils.js'

const TableCellBasic: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => {
  return (
    <td className={cn('object-set-table__td py-2', className)} {...props}>
      {children}
    </td>
  )
}

export { TableCellBasic }
