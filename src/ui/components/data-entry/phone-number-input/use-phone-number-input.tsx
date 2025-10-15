import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleFlag } from 'react-circle-flags'
import countries, { type Countries } from 'world-countries'
import {
  countDigitsBeforeCursor,
  formatPhoneNumber,
  getCallingCode,
  mapCursorPositionToFormattedText,
  parsePhoneValue,
  removePhoneNumberFormat,
} from './utils.js'
import type { PhoneNumberInputProps } from './types.js'
import type { SelectOption } from '../select/types.js'

interface UsePhoneNumberInputProps {
  value: PhoneNumberInputProps['value']
  defaultValue: PhoneNumberInputProps['defaultValue']
  onChange: PhoneNumberInputProps['onChange']
  onKeyDown: PhoneNumberInputProps['onKeyDown']
  onBlur: PhoneNumberInputProps['onBlur']
  onFocus: PhoneNumberInputProps['onFocus']
  allowedCountries: PhoneNumberInputProps['allowedCountries']
  excludedCountries: PhoneNumberInputProps['excludedCountries']
  includeDependentAreas: PhoneNumberInputProps['includeDependentAreas']
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
  externalRef?: React.ForwardedRef<HTMLInputElement>
}

const renderFlagIcon = (countryCode: string) => {
  return <CircleFlag className="size-4" countryCode={countryCode.toLowerCase()} height={16} />
}

export const usePhoneNumberInput = ({
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  allowedCountries,
  excludedCountries,
  includeDependentAreas = false,
  prefixOptionFormat = 'FlagsAndNumbers',
  externalRef,
}: UsePhoneNumberInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInternalChangeRef = useRef(false)
  const lastCursorPositionRef = useRef(0)

  const mergedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof externalRef === 'function') {
      externalRef(node)
    } else if (externalRef) {
      externalRef.current = node
    }
  }

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

  const getInitialValues = useCallback((rawValue: string, availableOptions: SelectOption[]) => {
    if (rawValue === '') return { selectValue: '', inputValue: '' }

    const parsedValue = parsePhoneValue(rawValue)
    if (parsedValue && availableOptions.some((o) => o.value === parsedValue.selectValue)) {
      const callingCode = parsedValue.selectValue.split('-')[0]
      const formattedValue = formatPhoneNumber(callingCode, parsedValue.inputValue)
      return {
        selectValue: parsedValue.selectValue,
        inputValue: formattedValue,
      }
    }

    return { selectValue: '', inputValue: rawValue }
  }, [])

  const initialValues = getInitialValues(defaultValue ?? '', options)
  const [selectValue, setSelectValue] = useState(initialValues.selectValue)
  const [inputValue, setInputValue] = useState(initialValues.inputValue)

  const handleSelectOnBlur = useCallback(
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

  const handleInputOnBlur = useCallback(
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

      if (inputValue !== '') {
        const unformattedInputValue = removePhoneNumberFormat(inputValue)

        if (newSelectValue === '') {
          lastCursorPositionRef.current = unformattedInputValue.length
          setInputValue(unformattedInputValue)
        } else {
          const formattedInputValue = formatPhoneNumber(callingCode, unformattedInputValue)
          lastCursorPositionRef.current = formattedInputValue.length
          setInputValue(formattedInputValue)
        }
      }

      isInternalChangeRef.current = true
      onChange?.(`${callingCode}${removePhoneNumberFormat(inputValue)}`)

      inputRef.current?.focus()
    },
    [inputValue, onChange]
  )

  const handleInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentCursorPosition = e.target.selectionStart ?? 0
      const previousUnformattedValue = removePhoneNumberFormat(inputValue)

      let callingCode = selectValue.split('-')[0]
      let currentUnformattedValue = removePhoneNumberFormat(e.target.value)

      // handle '00' prefix conversion to '+'
      if (selectValue === '' && currentUnformattedValue.startsWith('00')) {
        currentUnformattedValue = `+${currentUnformattedValue.substring(2)}`
      }

      const parsedPhoneNumber = parsePhoneValue(`${callingCode}${currentUnformattedValue}`)

      // auto-detect country when none is selected and it is a possible phone number
      if (selectValue === '' && parsedPhoneNumber && options.some((o) => o.value === parsedPhoneNumber.selectValue)) {
        setSelectValue(parsedPhoneNumber.selectValue)
        callingCode = parsedPhoneNumber.selectValue.split('-')[0]

        const autoFormattedValue = formatPhoneNumber(callingCode, parsedPhoneNumber.inputValue)
        lastCursorPositionRef.current = autoFormattedValue.length
        setInputValue(autoFormattedValue)

        isInternalChangeRef.current = true
        onChange?.(`${callingCode}${parsedPhoneNumber.inputValue}`)
      } else {
        // apply real-time formatting
        let formattedValue = currentUnformattedValue
        if (selectValue !== '' && currentUnformattedValue !== '') {
          formattedValue = formatPhoneNumber(callingCode, currentUnformattedValue)
        }

        // handle cursor position after formatting
        const unformattedLengthDifference = currentUnformattedValue.length - previousUnformattedValue.length
        const isLargeInsertion = unformattedLengthDifference > 1
        const isRemoval = unformattedLengthDifference < 0

        let targetCursorPositionInUnformatted = 0

        if (isRemoval) {
          // count how many digits are before the cursor in the current input value
          targetCursorPositionInUnformatted = countDigitsBeforeCursor(e.target.value, currentCursorPosition)
        } else if (isLargeInsertion) {
          // count digits before cursor in the new formatted value
          targetCursorPositionInUnformatted = countDigitsBeforeCursor(formattedValue, currentCursorPosition)
        } else {
          // use cursor position directly for single character insertion
          targetCursorPositionInUnformatted = Math.min(currentCursorPosition, currentUnformattedValue.length)
        }

        const finalCursorPosition = mapCursorPositionToFormattedText(
          currentUnformattedValue,
          formattedValue,
          targetCursorPositionInUnformatted
        )

        lastCursorPositionRef.current = finalCursorPosition
        setInputValue(formattedValue)

        isInternalChangeRef.current = true
        onChange?.(`${callingCode}${currentUnformattedValue}`)
      }
    },
    [selectValue, options, onChange, inputValue]
  )

  const handleInputOnKeyDown = useCallback(
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

  const handleInputOnFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.relatedTarget !== null) {
        inputRef.current?.setSelectionRange(e.target.value.length, e.target.value.length)
      }

      onFocus?.(e)
    },
    [onFocus]
  )

  useEffect(() => {
    if (value !== undefined) {
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false
        return
      }

      if (value === '') {
        setSelectValue('')
        setInputValue('')
        return
      }

      const parsedValue = parsePhoneValue(value)
      if (parsedValue && options.some((o) => o.value === parsedValue.selectValue)) {
        setSelectValue(parsedValue.selectValue)

        const callingCode = parsedValue.selectValue.split('-')[0]
        const formattedInputValue = formatPhoneNumber(callingCode, parsedValue.inputValue)
        lastCursorPositionRef.current = formattedInputValue.length
        setInputValue(formattedInputValue)
      } else {
        setSelectValue('')
        lastCursorPositionRef.current = value.length
        setInputValue(value)
      }
    }
  }, [value, options])

  // restore cursor position after input value change
  useEffect(() => {
    if (inputRef.current) {
      const position = Math.min(lastCursorPositionRef.current, inputValue.length)
      inputRef.current.setSelectionRange(position, position)
    }
  }, [inputValue])

  return {
    options,
    selectValue,
    inputValue,
    handleSelectOnChange,
    handleInputOnChange,
    handleInputOnKeyDown,
    handleSelectOnBlur,
    handleInputOnBlur,
    handleInputOnFocus,
    mergedRef,
    containerRef,
  }
}
