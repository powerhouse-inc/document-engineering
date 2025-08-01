import { useCallback, useState } from 'react'
import type { PhoneNumberInputProps } from './types.js'
import type { SelectOption } from '../select/types.js'

interface UsePhoneNumberInputProps {
  value: PhoneNumberInputProps['value']
  defaultValue: PhoneNumberInputProps['defaultValue']
  onChange: PhoneNumberInputProps['onChange']
  allowedCountries: PhoneNumberInputProps['allowedCountries']
  excludedCountries: PhoneNumberInputProps['excludedCountries']
  includeDependentAreas: PhoneNumberInputProps['includeDependentAreas']
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

export const usePhoneNumberInput = ({
  // TODO: return the correct options and implement the rest of the logic
  // value,
  // defaultValue,
  onChange,
  // allowedCountries,
  // excludedCountries,
  // includeDependentAreas,
  // prefixOptionFormat,
}: UsePhoneNumberInputProps) => {
  const [selectValue, setSelectValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const options: SelectOption[] = []

  const handleSelectOnChange = useCallback(
    (newSelectValue: string) => {
      setSelectValue(newSelectValue)
      const fullValue = `${newSelectValue}${inputValue}`
      onChange?.(fullValue)
    },
    [inputValue, onChange]
  )

  const handleInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value
      setInputValue(newInputValue)

      const fullValue = `${selectValue}${newInputValue}`
      onChange?.(fullValue)
    },
    [selectValue, onChange]
  )

  return {
    options,
    selectValue,
    inputValue,
    handleSelectOnChange,
    handleInputOnChange,
  }
}
