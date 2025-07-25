import type { Currency } from '../currency-code-picker/types.js'
import { useEffect, useMemo, useState } from 'react'
import { isValidNumber } from '../../../../scalars/components/number-field/number-field-validations.js'
import type { Amount, AmountCrypto, AmountCurrency, AmountFiat, AmountInputPropsGeneric, AmountValue } from './types.js'
import {
  createAmountValue,
  displayValueAmount,
  getDefaultUnits,
  handleEventOnBlur,
  handleEventOnChange,
  isNotSafeValue,
  isValidBigInt,
  isValidNumberGreaterThanMaxSafeInteger,
} from './utils.js'

interface UseAmountInputProps {
  value?: AmountValue
  defaultValue?: AmountValue
  type: AmountInputPropsGeneric['type']
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  precision?: number
  viewPrecision?: number
  trailingZeros?: boolean
  units?: Currency[]
}

export const useAmountInput = ({
  value,
  defaultValue,
  type,
  onChange,
  onBlur,
  precision,
  viewPrecision,
  trailingZeros,
  units,
}: UseAmountInputProps) => {
  const currentValue = value ?? defaultValue

  const baseValue = useMemo(() => {
    if (currentValue === undefined) {
      return undefined
    }

    // If it's an object (for any type), we extract the amount property
    if (typeof currentValue === 'object') {
      return currentValue.value
    }

    // If it's a primitive value (for AmountPercentage)
    return currentValue
  }, [currentValue])

  useEffect(() => {
    if (type === 'AmountPercentage') {
      if (typeof currentValue === 'object') {
        const newValue =
          (currentValue.value as unknown) === ''
            ? ''
            : (currentValue.value as unknown) === undefined
              ? ''
              : currentValue.value
        const nativeEvent = handleEventOnChange(newValue)
        onChange?.(nativeEvent)
        return
      }
      if (
        typeof currentValue === 'number' ||
        typeof currentValue === 'string' ||
        typeof currentValue === 'bigint' ||
        typeof currentValue === 'undefined'
      ) {
        const nativeEvent = handleEventOnChange(currentValue)
        onChange?.(nativeEvent as unknown as React.ChangeEvent<HTMLInputElement>)
      }
      return
    }

    // Only create object with unit for types that require it
    if (
      (type === 'AmountFiat' || type === 'AmountCrypto' || type === 'AmountCurrency') &&
      (typeof currentValue === 'number' || typeof currentValue === 'string')
    ) {
      const newValue = {
        value: currentValue,
        unit: '',
      }
      const nativeEvent = handleEventOnChange(newValue)
      onChange?.(nativeEvent)
    }
  }, [currentValue, onChange, type])

  const valueSelect = useMemo(() => {
    if (currentValue === undefined) {
      return undefined
    }

    // Type guard to check if currentValue is an object with a unit property
    if (typeof currentValue === 'object' && 'unit' in currentValue) {
      const typedValue = currentValue as { unit: string }
      return typedValue.unit
    }

    return undefined
  }, [currentValue])

  const isBigInt =
    type === 'AmountCrypto' ||
    (type === 'AmountCurrency' && isValidNumberGreaterThanMaxSafeInteger(baseValue?.toString()))

  const [inputFocused, setInputFocused] = useState(false)

  const rawAmountState = baseValue?.toString() ?? ''
  const displayValueAmountState = useMemo(() => {
    if (inputFocused) {
      return rawAmountState
    }

    if (!rawAmountState || rawAmountState === '') {
      return ''
    }

    if (type === 'Amount' || type === 'AmountPercentage' || type === 'AmountFiat') {
      if (!isValidNumber(rawAmountState) || isNotSafeValue(rawAmountState)) {
        // Return the value without formatting if not valid
        return baseValue?.toString() ?? ''
      }
    }
    if (type === 'AmountCrypto') {
      return baseValue?.toString()
    }
    if (type === 'AmountCurrency') {
      if (isValidNumberGreaterThanMaxSafeInteger(rawAmountState)) {
        //   // Return the value without formatting if not valid
        return baseValue?.toString() ?? ''
      }
      if (!isValidNumber(rawAmountState) || isNotSafeValue(rawAmountState)) {
        // Return the value without formatting if not valid
        return baseValue?.toString() ?? ''
      }
    }
    // Here its safe to format the value
    const formattedValue = displayValueAmount({ value: rawAmountState, precision, viewPrecision, trailingZeros })
    return formattedValue
  }, [inputFocused, type, baseValue, precision, viewPrecision, trailingZeros, rawAmountState])

  const isPercent = type === 'AmountPercentage'
  const isAmountWithUnit = type === 'Amount' && value && typeof value === 'object' && 'unit' in value
  const isAmountWithoutUnit = type === 'Amount' && !isAmountWithUnit

  const isShowSelect =
    (isAmountWithUnit && units && units.length > 0) ||
    type === 'AmountFiat' ||
    type === 'AmountCrypto' ||
    type === 'AmountCurrency'

  // Handle the change of the input
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (currentValue === undefined) {
      const nativeEvent = handleEventOnChange(createAmountValue(inputValue))
      onChange?.(nativeEvent)
      return
    }

    if (type === 'AmountFiat' && typeof value === 'object') {
      const newValue = {
        ...value,
        value: createAmountValue(inputValue),
      } as AmountValue

      const nativeEvent = handleEventOnChange(newValue)

      onChange?.(nativeEvent)
    }

    // Handle the change of the currency crypto
    if (type === 'AmountCrypto' && typeof value === 'object') {
      const newValueCurrencyCrypto = {
        ...value,
        value: createAmountValue(inputValue),
      } as AmountValue
      const nativeEvent = handleEventOnChange(newValueCurrencyCrypto)

      onChange?.(nativeEvent)
    }

    if (type === 'AmountPercentage') {
      const amountValue = inputValue
      const nativeEvent = handleEventOnChange(amountValue)
      onChange?.(nativeEvent)
    }
    // Handle the change of the universal amount
    if (type === 'AmountCurrency' && typeof value === 'object') {
      const newValue = {
        ...value,
        value: createAmountValue(inputValue),
      } as AmountValue

      const nativeEvent = handleEventOnChange(newValue)
      onChange?.(nativeEvent)
    }

    if (type === 'Amount' && typeof value === 'object') {
      const newValue = {
        ...value,
        value: createAmountValue(inputValue),
      } as AmountValue
      const nativeEvent = handleEventOnChange(newValue)
      onChange?.(nativeEvent)
    }
  }

  // Handle the change of the select
  const handleOnChangeSelect = (e: string) => {
    let newValue: AmountFiat | AmountCrypto | AmountCurrency | Amount = {} as
      | AmountFiat
      | AmountCrypto
      | AmountCurrency
      | Amount
    if (type === 'AmountFiat' && typeof value === 'object') {
      newValue = {
        ...value,
        unit: typeof e === 'string' ? e : undefined,
      } as AmountFiat
    }
    if (type === 'AmountCrypto' && typeof value === 'object') {
      newValue = {
        ...value,
        unit: typeof e === 'string' ? e : undefined,
      } as AmountCrypto
    }
    if (type === 'AmountCurrency' && typeof value === 'object') {
      newValue = {
        ...value,
        unit: typeof e === 'string' ? e : undefined,
      } as AmountCurrency
    }
    if (type === 'Amount' && typeof value === 'object') {
      newValue = {
        ...value,
        unit: typeof e === 'string' ? e : undefined,
      } as Amount
    }

    const nativeEvent = handleEventOnChange(newValue)
    onChange?.(nativeEvent)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputFocused(false)
    const inputValue = e.target.value
    // Avoid transformation if the value is not a number
    if (type === 'AmountFiat' && typeof value === 'object') {
      if (!isValidNumber(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        const nativeEvent = handleEventOnBlur(newValue)

        onBlur?.(nativeEvent)
        return
      }

      // Avoid transformation if the value is not a number
      if (isNotSafeValue(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        const nativeEvent = handleEventOnBlur(newValue)

        onBlur?.(nativeEvent)
        return
      }
      const formatValue = displayValueAmount({ value: inputValue, precision, viewPrecision, trailingZeros })
      // Update the state with the formatted value
      const newValue = {
        ...value,
        value: formatValue,
      }
      const nativeEvent = handleEventOnBlur(newValue)

      onBlur?.(nativeEvent)
    }

    if (type === 'AmountCrypto' && typeof value === 'object') {
      if (!isValidBigInt(inputValue) || isNotSafeValue(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }

        const nativeEventBlur = handleEventOnBlur(newValue)
        onBlur?.(nativeEventBlur)
        return
      }
      const newValue = {
        ...value,
        value: inputValue,
      }
      const nativeEventBlur = handleEventOnBlur(newValue)
      onBlur?.(nativeEventBlur)
    }

    if (type === 'AmountPercentage') {
      if (!isValidNumber(inputValue)) {
        const nativeEventBlur = handleEventOnBlur(inputValue)
        onBlur?.(nativeEventBlur)
        return
      }

      // Avoid transformation if the value is not a number
      if (isNotSafeValue(inputValue)) {
        const newValue = inputValue

        const nativeEventBlur = handleEventOnBlur(newValue)
        onBlur?.(nativeEventBlur)
        return
      }
      const formatValue = displayValueAmount({ value: inputValue, precision, viewPrecision, trailingZeros })
      const nativeEventBlur = handleEventOnBlur(formatValue)
      onBlur?.(nativeEventBlur)
      return
    }

    if (type === 'Amount' && typeof value === 'object') {
      if (!isValidNumber(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        const nativeEvent = handleEventOnBlur(newValue)

        onBlur?.(nativeEvent)
        return
      }

      // Avoid transformation if the value is not a number
      if (isNotSafeValue(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        const nativeEvent = handleEventOnBlur(newValue)

        onBlur?.(nativeEvent)
        return
      }
      const formatValue = displayValueAmount({ value: inputValue, precision, viewPrecision, trailingZeros })
      // Update the state with the formatted value
      const newValue = {
        ...value,
        value: formatValue,
      }
      const nativeEvent = handleEventOnBlur(newValue)

      onBlur?.(nativeEvent)
    }

    // Handle the blur event for AmountCurrency
    if (type === 'AmountCurrency' && typeof value === 'object') {
      if (isValidBigInt(inputValue) && isValidNumberGreaterThanMaxSafeInteger(inputValue)) {
        const formatValue = inputValue

        const nativeEventBlur = handleEventOnBlur(formatValue)
        onBlur?.(nativeEventBlur)
        return
      }
      // Avoid transformation if the value is not a number
      if (!isValidNumber(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        onBlur?.(newValue as unknown as React.FocusEvent<HTMLInputElement>)
        return
      }
      const formatValue =
        viewPrecision !== undefined
          ? trailingZeros
            ? parseFloat(inputValue).toFixed(viewPrecision)
            : parseFloat(parseFloat(inputValue).toFixed(viewPrecision)).toString()
          : inputValue
      if (isNotSafeValue(inputValue)) {
        const newValue = {
          ...value,
          value: inputValue,
        }
        const nativeEventBlur = handleEventOnBlur(newValue)
        onBlur?.(nativeEventBlur)
        return
      }
      const newValue = {
        ...value,
        value: formatValue,
      }
      onBlur?.(newValue as unknown as React.FocusEvent<HTMLInputElement>)
    }
  }

  const handleIsInputFocused = () => {
    setInputFocused(true)
  }
  const options = units ?? getDefaultUnits(type)
  // Put the placeholder in case that value its not in the options
  const validatedValueSelect = valueSelect && options.some((unit) => unit.ticker === valueSelect) ? valueSelect : ''
  return {
    isPercent,
    isShowSelect,
    options,
    valueInput: displayValueAmountState,
    valueSelect: validatedValueSelect,
    handleOnChangeInput,
    handleOnChangeSelect,
    handleBlur,
    isBigInt,
    handleIsInputFocused,
    inputFocused,
    isAmountWithoutUnit,
  }
}
