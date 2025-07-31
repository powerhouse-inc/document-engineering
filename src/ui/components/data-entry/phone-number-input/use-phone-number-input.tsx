import { useCallback, useMemo, useState } from 'react'
import { CircleFlag } from 'react-circle-flags'
import countries, { type Countries } from 'world-countries'
import { type CountryCode, getCountryCallingCode } from 'libphonenumber-js'
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

const renderFlagIcon = (countryCode: string) => {
  return <CircleFlag className="size-4" countryCode={countryCode.toLowerCase()} height={16} />
}

const getCallingCode = (countryCode: string): string | null => {
  try {
    const callingCode = getCountryCallingCode(countryCode as CountryCode)
    return `+${callingCode}`
  } catch {
    return null
  }
}

export const usePhoneNumberInput = ({
  // TODO: implement value and defaultValue handling
  // value,
  // defaultValue,
  onChange,
  allowedCountries,
  excludedCountries,
  includeDependentAreas = false,
  prefixOptionFormat = 'FlagsAndNumbers',
}: UsePhoneNumberInputProps) => {
  const [selectValue, setSelectValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const options: SelectOption[] = useMemo(() => {
    const defaultOptions = (countries as unknown as Countries)
      .filter(
        (country) =>
          (includeDependentAreas ? true : country.independent) &&
          country.cca2 !== 'AQ' && // exclude Antarctica
          getCallingCode(country.cca2) !== null // only countries with calling codes
      )
      .map((country) => {
        const callingCode = getCallingCode(country.cca2)!
        const countryCode = country.cca2

        let label = ''
        let icon: (() => JSX.Element) | undefined = undefined

        switch (prefixOptionFormat) {
          case 'CodesOnly':
            label = countryCode
            break
          case 'NumbersOnly':
            label = callingCode
            break
          case 'FlagsOnly':
            label = ''
            icon = () => renderFlagIcon(countryCode)
            break
          case 'FlagsAndCodes':
            label = countryCode
            icon = () => renderFlagIcon(countryCode)
            break
          case 'FlagsAndNumbers':
          default:
            label = callingCode
            icon = () => renderFlagIcon(countryCode)
            break
        }

        return {
          value: `${callingCode}-${countryCode}`,
          label,
          icon,
        }
      })
      .sort((a, b) => {
        const aCode = parseInt(a.value.split('-')[0].replace('+', ''))
        const bCode = parseInt(b.value.split('-')[0].replace('+', ''))
        return aCode - bCode
      })

    const filteredOptions =
      Array.isArray(allowedCountries) || Array.isArray(excludedCountries)
        ? defaultOptions.filter((option) => {
            const countryCode = option.value.split('-')[1]
            return (
              (!allowedCountries || allowedCountries.includes(countryCode)) && !excludedCountries?.includes(countryCode)
            )
          })
        : defaultOptions

    return filteredOptions
  }, [allowedCountries, excludedCountries, includeDependentAreas, prefixOptionFormat])

  const handleSelectOnChange = useCallback(
    (newSelectValue: string) => {
      setSelectValue(newSelectValue)
      const callingCode = newSelectValue.split('-')[0]
      const fullValue = `${callingCode}${inputValue}`
      onChange?.(fullValue)
    },
    [inputValue, onChange]
  )

  const handleInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value
      setInputValue(newInputValue)

      const callingCode = selectValue ? selectValue.split('-')[0] : ''
      const fullValue = `${callingCode}${newInputValue}`
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
