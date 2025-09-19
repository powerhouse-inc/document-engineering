import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderEmailCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return <div className={cn(getTextAlignmentClasses(context), 'break-all')}>{value?.toString() ?? ''}</div>
}

export { renderEmailCell }
