import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderDateCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const formatDate = (dateValue: unknown): string => {
    if (!dateValue) return ''

    try {
      const date = new Date(dateValue as string | Date)
      if (isNaN(date.getTime())) return String(dateValue)

      return date.toLocaleDateString()
    } catch {
      return String(dateValue)
    }
  }

  return (
    <div
      className={cn({
        'text-right': context.column.align === 'right',
        'text-center': context.column.align === 'center',
        'text-left': context.column.align === 'left' || !context.column.align,
      })}
    >
      {formatDate(value)}
    </div>
  )
}

export { renderDateCell }
