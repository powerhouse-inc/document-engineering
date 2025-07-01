import { cryptoCurrencies, currencies, fiatCurrencies } from '../currency-code-picker/utils.js'
import type { Currency } from '../currency-code-picker/types.js'
import type { AmountInputPropsGeneric, AmountValue } from './types.js'

export const getDefaultUnits = (type: AmountInputPropsGeneric['type']) => {
  switch (type) {
    case 'AmountFiat':
      return fiatCurrencies()
    case 'AmountCrypto':
      return cryptoCurrencies()
    case 'AmountCurrency':
      return currencies()
    case 'Amount':
    case 'AmountPercentage':
      return []
  }
}

/**
 * Checks if a given string value represents a valid BigInt.
 * A valid BigInt can be a positive or negative integer, or zero,
 * without decimal points or other non-digit characters (except for the leading minus sign).
 *
 * @param value The string to validate.
 * @returns True if the value is a valid BigInt string, false otherwise.
 */
export const isValidBigInt = (value: string | undefined): boolean => {
  // If the value is undefined or an empty string, it's not a valid BigInt.
  if (!value) {
    return false
  }

  const bigintRegex = /^-?\d+$/

  return bigintRegex.test(value)
}

export const isValidNumberGreaterThanMaxSafeInteger = (value: string | undefined) => {
  if (!value) {
    return false
  }
  const isValidBigIntValue = isValidBigInt(value)
  return isValidBigIntValue && Math.abs(Number(value)) > Number.MAX_SAFE_INTEGER
}

export const isNotSafeValue = (value: string) => {
  return Math.abs(Number(value)) > Number.MAX_SAFE_INTEGER
}

interface DisplayValueAmountProps {
  value?: string
  precision?: number
  viewPrecision?: number
  trailingZeros?: boolean
}

export const displayValueAmount = ({ value, precision, viewPrecision, trailingZeros }: DisplayValueAmountProps) => {
  if (!value) {
    return undefined // Return undefined if no value is provided
  }

  // If viewPrecision is provided but not precision, format to viewPrecision
  if (viewPrecision !== undefined && precision === undefined) {
    const formattedValue = parseFloat(value).toFixed(viewPrecision)
    return trailingZeros ? formattedValue : parseFloat(formattedValue).toString()
  }

  // If precision is provided but not viewPrecision, truncate to precision
  if (precision !== undefined && viewPrecision === undefined) {
    const formattedValue = parseFloat(value).toFixed(precision)

    // If the number of decimals is greater than or equal to the precision, apply toFixed
    return trailingZeros ? formattedValue : parseFloat(formattedValue).toString()
  }

  // If both are present, show the value with viewPrecision when focused
  if (precision !== undefined && viewPrecision !== undefined) {
    const formattedValue = parseFloat(value).toFixed(viewPrecision)
    return trailingZeros ? formattedValue : parseFloat(formattedValue)
  }
  return value
}

export const handleEventOnChange = <T>(value: T) => {
  const nativeEvent = new Event('change', { bubbles: true, cancelable: true })

  Object.defineProperty(nativeEvent, 'target', {
    value: { value },

    writable: false,
  })

  return nativeEvent as unknown as React.ChangeEvent<HTMLInputElement>
}

export const handleEventOnBlur = <T>(value: T) => {
  const nativeEvent = new Event('blur', { bubbles: true, cancelable: true })

  Object.defineProperty(nativeEvent, 'target', {
    value: { value },

    writable: false,
  })

  return nativeEvent as unknown as React.FocusEvent<HTMLInputElement>
}

export const createAmountValue = (inputValue: string) => {
  return inputValue === '' ? undefined : inputValue
}

export const isValidUnit = (type: AmountInputPropsGeneric['type'], value: AmountValue, units?: Currency[]) => {
  if (!units) return true
  if (type === 'Amount' && typeof value === 'object' && 'unit' in value) {
    return units.some((u) => u.ticker === value.unit)
  }
  if (type === 'AmountCurrency' && typeof value === 'object') {
    return units.some((u) => u.ticker === value.unit)
  }
  if (type === 'AmountCrypto' && typeof value === 'object') {
    return units.some((u) => u.ticker === value.unit)
  }
  if (type === 'AmountFiat' && typeof value === 'object') {
    return units.some((u) => u.ticker === value.unit)
  }
  return false
}
