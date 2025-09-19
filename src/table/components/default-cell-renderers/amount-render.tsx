import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, DataType } from '../../table/types.js'
import type { Amount } from '../../../ui/components/data-entry/amount-input/types.js'

const renderAmountCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const formatAmount = (rawValue: unknown): string => {
    if (typeof rawValue === 'object' && rawValue !== null && 'value' in rawValue) {
      const amount = rawValue as Amount
      if (amount.value !== undefined && amount.unit) {
        return `${amount.value} ${amount.unit}`
      }
      if (amount.value !== undefined) {
        return amount.value.toString()
      }
    }
    if (typeof rawValue === 'number') {
      return rawValue.toString()
    }
    return ''
  }

  return (
    <div
      className={cn(
        {
          'text-right': context.column.align === 'right',
          'text-center': context.column.align === 'center',
          'text-left': context.column.align === 'left' || !context.column.align,
        },
        'font-semibold'
      )}
    >
      {formatAmount(value)}
    </div>
  )
}

export { renderAmountCell }
