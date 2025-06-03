import { cn } from '../../../../../scalars/lib/utils.js'
import type { CellContext } from '../../types.js'

const defaultHeaderRenderer = <T, V = string>(value: V, context: CellContext<T>) => {
  let classes = ''
  if (context.column.width) classes += ` w-[${context.column.width}]`
  if (context.column.minWidth) classes += ` min-w-[${context.column.minWidth}]`
  if (context.column.maxWidth) classes += ` max-w-[${context.column.maxWidth}]`
  if (context.column.align) classes += ` text-${context.column.align}`

  return (
    <div className={cn('px-[12px] py-[15px] text-left text-[14px] font-medium leading-[14px] text-gray-500', classes)}>
      {value as string}
    </div>
  )
}

export { defaultHeaderRenderer }
