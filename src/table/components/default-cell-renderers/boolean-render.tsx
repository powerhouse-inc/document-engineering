import { cn } from '../../../scalars/lib/utils.js'
import { Checkbox } from '../../../ui/components/data-entry/checkbox/checkbox.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderBooleanCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
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
