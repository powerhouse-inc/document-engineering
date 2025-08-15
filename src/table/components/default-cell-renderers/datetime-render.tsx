import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderDateTimeCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const formatDateTime = (dateValue: unknown): string => {
    if (!dateValue) return ''

    try {
      const date = new Date(dateValue as string | Date)
      if (isNaN(date.getTime())) return String(dateValue)

      return date.toLocaleString()
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
      {formatDateTime(value)}
    </div>
  )
}

export { renderDateTimeCell }
