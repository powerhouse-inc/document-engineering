import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleFlag } from 'react-circle-flags'
import countries, { type Countries } from 'world-countries'
import parsePhoneNumber, { type CountryCode, getCountryCallingCode } from 'libphonenumber-js'
import type { PhoneNumberInputProps } from './types.js'
import type { SelectOption } from '../select/types.js'

interface UsePhoneNumberInputProps {
  value: PhoneNumberInputProps['value']
  defaultValue: PhoneNumberInputProps['defaultValue']
  onChange: PhoneNumberInputProps['onChange']
  onKeyDown: PhoneNumberInputProps['onKeyDown']
  onBlur: PhoneNumberInputProps['onBlur']
  allowedCountries: PhoneNumberInputProps['allowedCountries']
  excludedCountries: PhoneNumberInputProps['excludedCountries']
  includeDependentAreas: PhoneNumberInputProps['includeDependentAreas']
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
  externalRef?: React.ForwardedRef<HTMLInputElement>
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

const parsePhoneValue = (rawValue: string) => {
  if (rawValue === '') return null

  const sanitizedValue = `+${rawValue.replace(/\D/g, '')}`
  const parsedValue = parsePhoneNumber(sanitizedValue, { extract: false })

  if (parsedValue?.isPossible() && parsedValue.country) {
    const expectedValue = `+${parsedValue.countryCallingCode}${parsedValue.nationalNumber}`
    if (sanitizedValue !== expectedValue) {
      return null // the number was corrected by the library, reject it
    }

    const callingCode = `+${parsedValue.countryCallingCode}`
    const selectValue = `${callingCode}-${parsedValue.country}`
    const inputValue = parsedValue.nationalNumber
    return { selectValue, inputValue }
  }

  return null
}

export const usePhoneNumberInput = ({
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onBlur,
  allowedCountries,
  excludedCountries,
  includeDependentAreas = false,
  prefixOptionFormat = 'FlagsAndNumbers',
  externalRef,
}: UsePhoneNumberInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const mergedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof externalRef === 'function') {
      externalRef(node)
    } else if (externalRef) {
      externalRef.current = node
    }
  }

  const [selectValue, setSelectValue] = useState(() => {
    const parsedValue = parsePhoneValue(value ?? defaultValue ?? '')
    return parsedValue?.selectValue ?? ''
  })

  const [inputValue, setInputValue] = useState(() => {
    const rawValue = value ?? defaultValue ?? ''
    const parsedValue = parsePhoneValue(rawValue)
    return parsedValue?.inputValue ?? rawValue.replace(/\D/g, '')
  })

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

    const allowedCountriesArray = Array.isArray(allowedCountries) ? allowedCountries : undefined
    const excludedCountriesArray = Array.isArray(excludedCountries) ? excludedCountries : undefined

    const filteredOptions =
      allowedCountriesArray || excludedCountriesArray
        ? defaultOptions.filter((option) => {
            const countryCode = option.value.split('-')[1]
            const isAllowedCountry = allowedCountriesArray ? allowedCountriesArray.includes(countryCode) : true
            const isExcludedCountry = excludedCountriesArray ? !excludedCountriesArray.includes(countryCode) : true
            return isAllowedCountry && isExcludedCountry
          })
        : defaultOptions

    return filteredOptions
  }, [allowedCountries, excludedCountries, includeDependentAreas, prefixOptionFormat])

  const handleSelectBlur = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      setTimeout(() => {
        const activeElement = document.activeElement
        const container = containerRef.current

        if (container && activeElement && container.contains(activeElement)) {
          return
        }

        onBlur?.(e as React.FocusEvent<HTMLInputElement>)
      }, 0)
    },
    [onBlur]
  )

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const activeElement = document.activeElement
        const container = containerRef.current

        if (container && activeElement && container.contains(activeElement)) {
          return
        }

        onBlur?.(e)
      }, 0)
    },
    [onBlur]
  )

  const handleSelectOnChange = useCallback(
    (newSelectValue: string) => {
      setSelectValue(newSelectValue)

      const callingCode = newSelectValue.split('-')[0]
      onChange?.(callingCode)

      if (newSelectValue !== '') {
        inputRef.current?.focus()
      }
    },
    [onChange]
  )

  const handleInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const callingCode = selectValue.split('-')[0]
      const parsedValue = parsePhoneValue(`${callingCode}${e.target.value}`)
      if (selectValue === '' && parsedValue && options.some((o) => o.value === parsedValue.selectValue)) {
        setSelectValue(parsedValue.selectValue)
        setInputValue(parsedValue.inputValue)
        const callingCode = parsedValue.selectValue.split('-')[0]
        onChange?.(`${callingCode}${parsedValue.inputValue}`)
      } else {
        const newInputValue = e.target.value.replace(/\D/g, '')
        setInputValue(newInputValue)
        onChange?.(`${callingCode}${newInputValue}`)
      }
    },
    [options, selectValue, onChange]
  )

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isCopyShortcut =
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || (e.metaKey && (e.key === 'c' || e.key === 'C'))

      const isCutShortcut =
        (e.ctrlKey && (e.key === 'x' || e.key === 'X')) || (e.metaKey && (e.key === 'x' || e.key === 'X'))

      const isPasteShortcut =
        (e.ctrlKey && (e.key === 'v' || e.key === 'V')) || (e.metaKey && (e.key === 'v' || e.key === 'V'))

      const isSelectAllShortcut =
        (e.ctrlKey && (e.key === 'a' || e.key === 'A')) || (e.metaKey && (e.key === 'a' || e.key === 'A'))

      const allowed = new Set([
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'Tab',
        'Enter',
        'Escape',
      ])

      const isDigit = /^[0-9]$/.test(e.key)

      if (isCopyShortcut || isCutShortcut || isPasteShortcut || isSelectAllShortcut || allowed.has(e.key) || isDigit) {
        onKeyDown?.(e)
        return
      }

      e.preventDefault()
      onKeyDown?.(e)
    },
    [onKeyDown]
  )

  useEffect(() => {
    if (value !== undefined) {
      if (value === '') {
        setSelectValue('')
        setInputValue('')
        return
      }

      const parsedValue = parsePhoneValue(value)
      if (parsedValue && options.some((o) => o.value === parsedValue.selectValue)) {
        setSelectValue(parsedValue.selectValue)
        setInputValue(parsedValue.inputValue)
      }
    }
  }, [value, options])

  return {
    options,
    selectValue,
    inputValue,
    handleSelectOnChange,
    handleInputOnChange,
    handleOnKeyDown,
    handleSelectBlur,
    handleInputBlur,
    mergedRef,
    containerRef,
  }
}
