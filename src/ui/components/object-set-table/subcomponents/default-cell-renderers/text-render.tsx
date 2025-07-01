import { cn } from '../../../../../scalars/lib/utils.js'
import type { CellContext } from '../../types.js'

const renderTextCell = (value: unknown, context: CellContext) => {
  return (
    <div
      className={cn({
        'text-right': context.column.align === 'right',
        'text-center': context.column.align === 'center',
        'text-left': context.column.align === 'left' || !context.column.align,
      })}
    >
      {value?.toString() ?? ''}
    </div>
  )
}

export { renderTextCell }
