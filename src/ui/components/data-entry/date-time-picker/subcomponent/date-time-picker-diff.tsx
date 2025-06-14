import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { IconName } from '../../../icon-components/index.js'
import { FormLabel } from '../../../../../scalars/components/fragments/form-label/form-label.js'
import { Icon } from '../../../icon/icon.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { InputDiff } from '../../input/subcomponent/input-diff.js'
import { TextDiff } from '../../input/subcomponent/text-diff.js'
import type { DateFieldValue } from '../../date-picker/types.js'
import { getDateFormat } from '../utils.js'
import { parseDateTimeValueToInput } from '../use-date-time-picker.js'
import { formatInputToDisplayValid } from '../../time-picker/utils.js'

interface DateTimeInputDiffProps
  extends Omit<WithDifference<DateFieldValue>, 'diffMode'>,
    React.HTMLAttributes<HTMLDivElement> {
  icon: IconName
  value: DateFieldValue
  label?: string
  required?: boolean
  dateFormat?: string
  timeFormat?: string
  timeIntervals?: number
}

const DateTimeInputDiff = ({
  value,
  baseValue,
  viewMode,
  icon,
  label,
  required,
  dateFormat,
  timeFormat = 'hh:mm a',
  timeIntervals = 1,
  ...props
}: DateTimeInputDiffProps) => {
  const internalFormat = getDateFormat(dateFormat ?? '')
  const newValue = parseDateTimeValueToInput(value ?? '', internalFormat)
  const newBaseValue = parseDateTimeValueToInput(baseValue ?? '', internalFormat)

  const is12HourFormat = timeFormat.includes('a') || timeFormat.includes('A')
  const valueSplitDate = newValue.split(' ')[0]
  const valueSplitTime = newValue.split(' ')[1]
  const formattedValueTime = formatInputToDisplayValid(valueSplitTime, is12HourFormat, timeIntervals)
  const baseSplitDate = newBaseValue.split(' ')[0]
  const baseSplitTime = newBaseValue.split(' ')[1]
  const formattedBaseTime = formatInputToDisplayValid(baseSplitTime, is12HourFormat, timeIntervals)
  return (
    <>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <InputDiff className={cn('group')} {...props}>
        {viewMode === 'mixed' ? (
          <>
            <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
              <Icon name={icon} size={16} />
              <TextDiff
                value={`${valueSplitDate} ${formattedValueTime}`}
                baseValue={`${baseSplitDate} ${formattedBaseTime}`}
                viewMode="removal"
                diffMode="sentences"
                className={cn('flex-1')}
              />
            </div>
            <div className={cn('ml-3 mr-3 h-[34px] w-px bg-gray-300')} />
            <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
              <Icon name={icon} size={16} />
              <TextDiff
                value={`${valueSplitDate} ${formattedValueTime}`}
                baseValue={`${baseSplitDate} ${formattedBaseTime}`}
                viewMode="addition"
                diffMode="sentences"
                className={cn('flex-1')}
              />
            </div>
          </>
        ) : (
          <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
            <Icon name={icon} size={16} />
            <TextDiff
              value={`${valueSplitDate} ${formattedValueTime}`}
              baseValue={`${baseSplitDate} ${formattedBaseTime}`}
              viewMode={viewMode}
              diffMode="sentences"
              className={cn('flex-1')}
            />
          </div>
        )}
      </InputDiff>
    </>
  )
}

export default DateTimeInputDiff
