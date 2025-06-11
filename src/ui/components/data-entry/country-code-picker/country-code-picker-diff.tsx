import { FormGroup, FormLabel } from '../../../../scalars/components/fragments/index.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
import type { CountryCodePickerProps, CountryCodePickerWithDifference } from './types.js'

interface CountryCodePickerDiffProps extends CountryCodePickerWithDifference {
  value: string
  label: CountryCodePickerProps['label']
  required: CountryCodePickerProps['required']
}

const CountryCodePickerDiff = ({
  value = '',
  label,
  required,
  viewMode,
  baseValue = '',
}: CountryCodePickerDiffProps) => {
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

export { CountryCodePickerDiff }
