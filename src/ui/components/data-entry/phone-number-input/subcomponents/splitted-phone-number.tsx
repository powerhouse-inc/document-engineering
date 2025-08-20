import { cn } from '../../../../../scalars/lib/index.js'
import { InputDiff } from '../../input/subcomponent/input-diff.js'
import { PhoneNumberDiff } from './phone-number-diff.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { SelectOption } from '../../select/types.js'
import type { PhoneNumberInputProps } from '../types.js'

interface SplittedPhoneNumberDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  options: SelectOption[]
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

const SplittedPhoneNumberDiff = ({
  baseValue,
  value,
  viewMode,
  options,
  prefixOptionFormat,
}: SplittedPhoneNumberDiffProps) => {
  return (
    <InputDiff className={cn('group')} data-testid="phone-number-input-diff">
      {viewMode === 'mixed' ? (
        <>
          <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
            <PhoneNumberDiff
              baseValue={baseValue}
              value={value}
              viewMode="removal"
              options={options}
              prefixOptionFormat={prefixOptionFormat}
            />
          </div>
          <div className={cn('mx-3 w-px bg-gray-300 self-stretch')} />
          <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
            <PhoneNumberDiff
              baseValue={baseValue}
              value={value}
              viewMode="addition"
              options={options}
              prefixOptionFormat={prefixOptionFormat}
            />
          </div>
        </>
      ) : (
        <div className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate')}>
          <PhoneNumberDiff
            baseValue={baseValue}
            value={value}
            viewMode={viewMode}
            options={options}
            prefixOptionFormat={prefixOptionFormat}
          />
        </div>
      )}
    </InputDiff>
  )
}

export { SplittedPhoneNumberDiff }
