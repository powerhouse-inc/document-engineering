import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderDateCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const formatDate = (dateValue: unknown): string => {
    if (!dateValue) return ''

    try {
      const date = new Date(dateValue as string | Date)
      if (isNaN(date.getTime())) return typeof dateValue === 'string' ? dateValue : ''

      return date.toLocaleDateString()
    } catch {
      return typeof dateValue === 'string' ? dateValue : ''
    }
  }

  return <div className={cn(getTextAlignmentClasses(context), 'font-semibold')}>{formatDate(value)}</div>
}

export { renderDateCell }
