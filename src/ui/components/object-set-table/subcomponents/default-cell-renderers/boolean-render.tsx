import { cn } from '../../../../../scalars/lib/utils.js'
import { Checkbox } from '../../../data-entry/checkbox/checkbox.js'
import type { CellContext } from '../../types.js'

const renderBooleanCell = (value: unknown, context: CellContext) => {
  return (
    <div
      className={cn(
        {
          'justify-end': context.column.align === 'right',
          'justify-center': context.column.align === 'center',
          'justify-start': context.column.align === 'left' || !context.column.align,
        },
        'flex w-full'
      )}
    >
      <Checkbox value={String(value) === 'true'} disabled={true} />
    </div>
  )
}

export { renderBooleanCell }
