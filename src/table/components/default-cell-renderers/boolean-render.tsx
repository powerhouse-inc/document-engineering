import { cn } from '../../../scalars/lib/utils.js'
import { Checkbox } from '../../../ui/components/data-entry/checkbox/index.js'
import { getJustifyAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const renderBooleanCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  return (
    <div className={cn(getJustifyAlignmentClasses(context), 'flex w-full [&_button]:!mr-0')}>
      <Checkbox value={String(value) === 'true'} disabled={true} />
    </div>
  )
}

export { renderBooleanCell }
