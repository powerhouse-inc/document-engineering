import { FormGroup, FormLabel } from '../../../../../scalars/components/fragments/index.js'
import { SplittedPhoneNumberDiff } from './splitted-phone-number.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { SelectOption } from '../../select/types.js'
import type { PhoneNumberInputProps } from '../types.js'

interface PhoneNumberInputDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  label: PhoneNumberInputProps['label']
  required: PhoneNumberInputProps['required']
  options: SelectOption[]
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

const PhoneNumberInputDiff = ({
  value,
  label,
  required,
  options,
  prefixOptionFormat,
  viewMode,
  baseValue,
}: PhoneNumberInputDiffProps) => {
  return (
    <FormGroup>
      {!!label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedPhoneNumberDiff
        baseValue={baseValue}
        value={value}
        viewMode={viewMode}
        options={options}
        prefixOptionFormat={prefixOptionFormat}
      />
    </FormGroup>
  )
}

export { PhoneNumberInputDiff }
