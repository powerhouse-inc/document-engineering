import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { AmountValue } from '../types.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { InputDiff } from '../../input/subcomponent/input-diff.js'
import { AmountDiff } from './fake-amount-diff.js'
import type { Currency } from '../../currency-code-picker/index.js'

interface SplittedInputDiffProps
  extends Omit<WithDifference<AmountValue>, 'diffMode'>,
    React.HTMLAttributes<HTMLDivElement> {
  value?: AmountValue
  currencyPosition?: 'left' | 'right'
  options?: Currency[]
  symbolPosition?: 'left' | 'right'
  includeCurrencySymbols?: boolean
}

const SplittedAmountDiff = ({
  baseValue,
  value,
  viewMode,
  currencyPosition,
  options,
  symbolPosition,
  includeCurrencySymbols,
  ...props
}: SplittedInputDiffProps) => {
  return (
    <InputDiff className={cn('group')} data-testid="amount-input-diff" {...props}>
      {viewMode === 'mixed' ? (
        <div className={cn('flex flex-1')}>
          <div className={cn('flex flex-1 items-center gap-2 truncate')}>
            <AmountDiff
              baseValue={baseValue}
              value={value}
              viewMode="removal"
              currencyPosition={currencyPosition}
              options={options}
              symbolPosition={symbolPosition}
              includeCurrencySymbols={includeCurrencySymbols}
              diffMode="sentences"
            />
          </div>
          <div className={cn('ml-3 mr-3 h-[36px] w-px bg-gray-300 shrink-0')} />
          <div className={cn('flex flex-1 items-center gap-2 truncate')}>
            <AmountDiff
              baseValue={baseValue}
              value={value}
              viewMode="addition"
              currencyPosition={currencyPosition}
              options={options}
              symbolPosition={symbolPosition}
              includeCurrencySymbols={includeCurrencySymbols}
              diffMode="sentences"
            />
          </div>
        </div>
      ) : (
        <div className={cn('flex flex-1 items-center gap-2 truncate')}>
          <AmountDiff
            baseValue={baseValue}
            value={value}
            viewMode={viewMode}
            currencyPosition={currencyPosition}
            options={options}
            symbolPosition={symbolPosition}
            includeCurrencySymbols={includeCurrencySymbols}
            diffMode="sentences"
          />
        </div>
      )}
    </InputDiff>
  )
}

export { SplittedAmountDiff }
