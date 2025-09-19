import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderAidCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return (
    <div
      className={cn(getTextAlignmentClasses(context), 'truncate')}
      style={{ maxWidth: context.column.maxWidth ?? context.column.width }}
    >
      {value?.toString() ?? ''}
    </div>
  )
}

export { renderAidCell }
