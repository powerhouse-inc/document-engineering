import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderCurrencyCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return <div className={cn(getTextAlignmentClasses(context), 'font-semibold')}>{value?.toString() ?? ''}</div>
}

export { renderCurrencyCell }
