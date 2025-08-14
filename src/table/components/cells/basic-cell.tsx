import { cn } from '../../../scalars/lib/utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'

const TableCellBasic: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => {
  const {
    config: { minRowHeight },
  } = useInternalTableState()

  return (
    <td className={cn('object-set-table__td', className)} {...props}>
      <div className="flex flex-col" style={{ minHeight: minRowHeight === 'auto' ? '100%' : minRowHeight }}>
        {children}
      </div>
    </td>
  )
}

export { TableCellBasic }
