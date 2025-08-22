import { FormGroup, FormLabel } from '../../../../../scalars/components/fragments/index.js'
import { SplittedPhoneNumberDiff } from './splitted-phone-number.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { SelectOption } from '../../select/types.js'
import type { PhoneNumberInputProps } from '../types.js'

interface PhoneNumberInputDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  selectValue: string
  inputValue: string
  label: PhoneNumberInputProps['label']
  required: PhoneNumberInputProps['required']
  options: SelectOption[]
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

const PhoneNumberInputDiff = ({
  selectValue,
  inputValue,
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
        selectValue={selectValue}
        inputValue={inputValue}
        viewMode={viewMode}
        options={options}
        prefixOptionFormat={prefixOptionFormat}
      />
    </FormGroup>
  )
}

export { PhoneNumberInputDiff }
