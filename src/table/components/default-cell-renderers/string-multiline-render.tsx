import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderStringMultilineCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return <div className={cn('whitespace-pre-wrap', getTextAlignmentClasses(context))}>{value?.toString() ?? ''}</div>
}

export { renderStringMultilineCell }
