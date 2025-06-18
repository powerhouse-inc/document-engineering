import { FormGroup, FormLabel } from '../../../../../scalars/components/fragments/index.js'
import type { ViewMode, WithDifference } from '../../../../../scalars/components/types.js'
import type { AmountValue } from '../types.js'
import { SplittedAmountDiff } from './splitted-amount.js'
import type { Currency } from '../../currency-code-picker/index.js'

interface AmountInputDiffProps extends WithDifference<AmountValue> {
  value?: AmountValue
  viewMode?: ViewMode
  label?: React.ReactNode
  required?: boolean
  currencyPosition?: 'left' | 'right'
  options?: Currency[]
  symbolPosition?: 'left' | 'right'
  includeCurrencySymbols?: boolean
}

const AmountInputDiff = ({
  baseValue,
  value,
  viewMode,
  label,
  required,
  currencyPosition,
  options,
  symbolPosition,
  includeCurrencySymbols,
}: AmountInputDiffProps) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedAmountDiff
        baseValue={baseValue}
        value={value}
        viewMode={viewMode}
        currencyPosition={currencyPosition}
        options={options}
        symbolPosition={symbolPosition}
        includeCurrencySymbols={includeCurrencySymbols}
      />
    </FormGroup>
  )
}

export { AmountInputDiff }
