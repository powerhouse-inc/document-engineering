import { cn } from '../../../../../scalars/lib/utils.js'
import type { CellContext } from '../../types.js'
import { SortIndicator } from '../sort-indicator.js'
import { useInternalTableState } from '../table-provider/table-provider.js'

const DefaultHeaderContent = ({ value, context }: { value: string; context: CellContext }) => {
  const { state } = useInternalTableState()

  let classes = ''
  if (context.column.width) classes += ` w-[${context.column.width}]`
  if (context.column.minWidth) classes += ` min-w-[${context.column.minWidth}]`
  if (context.column.maxWidth) classes += ` max-w-[${context.column.maxWidth}]`
  if (context.column.align) {
    const align = context.column.align
    switch (align) {
      case 'left':
        classes += ' justify-start'
        break
      case 'center':
        classes += ' justify-center'
        break
      case 'right':
        classes += ' justify-end'
        break
    }
  }

  const isSorted = context.columnIndex === state.sortState?.columnIndex
  const sortingDirection = state.sortState?.direction ?? null

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        'px-[12px] py-[15px] text-left text-[14px] font-medium leading-[14px] text-gray-500',
        classes
      )}
    >
      <span>{value}</span>
      {context.column.sortable && <SortIndicator direction={isSorted ? sortingDirection : null} />}
    </div>
  )
}

const defaultHeaderRenderer = <T, V = string>(value: V, context: CellContext<T>) => {
  return <DefaultHeaderContent value={value as string} context={context} />
}

export { defaultHeaderRenderer }
