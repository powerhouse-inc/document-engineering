import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderEnumCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return (
    <div
      className={cn(
        {
          'text-right': context.column.align === 'right',
          'text-center': context.column.align === 'center',
          'text-left': context.column.align === 'left' || !context.column.align,
        },
        'break-all'
      )}
    >
      {value?.toString().replace(/,\s*/g, ', ')}
    </div>
  )
}

export { renderEnumCell }
