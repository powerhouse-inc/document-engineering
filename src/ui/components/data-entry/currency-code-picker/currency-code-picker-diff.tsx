import { FormGroup, FormLabel } from '../../../../scalars/components/fragments/index.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
import type { CurrencyCodePickerProps, CurrencyCodePickerWithDifference } from './types.js'

interface CurrencyCodePickerDiffProps extends CurrencyCodePickerWithDifference {
  value: string
  label: CurrencyCodePickerProps['label']
  required: CurrencyCodePickerProps['required']
}

const CurrencyCodePickerDiff = ({
  value = '',
  label,
  required,
  viewMode,
  baseValue = '',
}: CurrencyCodePickerDiffProps) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedInputDiff baseValue={baseValue} value={value} viewMode={viewMode} diffMode="sentences" />
    </FormGroup>
  )
}

export { CurrencyCodePickerDiff }
