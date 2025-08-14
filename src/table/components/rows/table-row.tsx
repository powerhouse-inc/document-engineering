import { forwardRef } from 'react'
import { cn } from '../../../scalars/lib/utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ children, className, index, ...props }, ref) => {
  const {
    state: { selectedRowIndexes, selectedCellIndex, selectedRowErrors },
  } = useInternalTableState()

  const isSelected = selectedRowIndexes.includes(index)
  const isNextRowSelected = selectedRowIndexes.includes(index + 1)
  const isPrevRowSelected = selectedRowIndexes.includes(index - 1)
  const hasErrors = selectedCellIndex?.row === index && Array.isArray(selectedRowErrors) && selectedRowErrors.length > 0

  return (
    <tr
      ref={ref}
      className={cn(
        'group/row',
        isSelected ? 'border-b border-t bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100',
        hasErrors && 'bg-red-100 hover:bg-red-100',
        !isSelected && !isNextRowSelected && 'not-last:border-b border-gray-100',
        isSelected && (isPrevRowSelected ? 'border-t-transparent' : 'border-t-blue-900'),
        isSelected && (isNextRowSelected ? 'border-b-transparent' : 'border-b-blue-900'),
        className
      )}
      data-selected={isSelected}
      {...props}
    >
      {children}
    </tr>
  )
})

TableRow.displayName = 'TableRow'

export { TableRow }
