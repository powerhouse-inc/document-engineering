import { format } from 'date-fns'
import { FormLabel } from '../../../../../../scalars/components/fragments/index.js'
import type { WithDifference } from '../../../../../../scalars/components/types.js'
import { cn } from '../../../../../../scalars/lib/utils.js'
import type { IconName } from '../../../../icon-components/index.js'
import { Icon } from '../../../../icon/icon.js'
import { InputDiff } from '../../../input/subcomponent/input-diff.js'
import { TextDiff } from '../../../input/subcomponent/text-diff.js'
import type { DateFieldValue } from '../../types.js'
import { getDateFormat } from '../../../date-time-picker/utils.js'

interface DateInputDiffProps extends WithDifference<DateFieldValue> {
  icon: IconName
  value: DateFieldValue
  label?: string
  required?: boolean
  dateFormat?: string
}

const DateInputDiff = ({
  baseValue,
  value,
  viewMode,
  diffMode,
  icon,
  label,
  required,
  dateFormat,
}: DateInputDiffProps) => {
  const internalFormat = getDateFormat(dateFormat ?? '') ?? 'dd/MM/yyyy'
  const baseDate = baseValue ? format(new Date(baseValue), internalFormat) : ''
  const valueDate = value ? format(new Date(value), internalFormat) : ''

  return (
    <>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <InputDiff className={cn('group')} data-testid="date-picker-diff-input">
        {viewMode === 'mixed' ? (
          <>
            <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
              <Icon name={icon} size={16} />
              <TextDiff
                baseValue={baseDate}
                value={valueDate}
                viewMode="removal"
                diffMode={diffMode}
                className={cn('flex-1')}
              />
            </div>
            <div className={cn('ml-3 mr-3 h-[34px] w-px bg-gray-300')} />
            <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
              <Icon name={icon} size={16} />
              <TextDiff
                baseValue={baseDate}
                value={valueDate}
                viewMode="addition"
                diffMode={diffMode}
                className={cn('flex-1')}
              />
            </div>
          </>
        ) : (
          <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
            <Icon name={icon} size={16} />
            <TextDiff
              baseValue={baseDate}
              value={valueDate}
              viewMode={viewMode}
              diffMode={diffMode}
              className={cn('flex-1')}
            />
          </div>
        )}
      </InputDiff>
    </>
  )
}

export default DateInputDiff
