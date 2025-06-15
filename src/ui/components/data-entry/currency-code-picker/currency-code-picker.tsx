import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Select, type SelectOption } from '../select/index.js'
import { getCurrencies } from './utils.js'
import { CurrencyCodePickerDiff } from './currency-code-picker-diff.js'
import type { CurrencyCodePickerProps } from './types.js'

const CurrencyCodePicker = React.forwardRef<HTMLButtonElement, CurrencyCodePickerProps>(
  (
    {
      placeholder,
      currencies = [],
      favoriteCurrencies = [],
      includeCurrencySymbols = true,
      symbolPosition = 'right',
      searchable = false,
      contentAlign = 'start',
      allowedTypes = 'Both',
      value,
      defaultValue,
      onChange,
      label,
      required,
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '')

    const defaultCurrencies = currencies.length > 0 ? currencies : getCurrencies(allowedTypes)
    const options: SelectOption[] = useMemo(() => {
      const favoriteTickers = new Set(favoriteCurrencies)

      return defaultCurrencies
        .map((currency) => {
          if (favoriteTickers.has(currency.ticker)) {
            return null
          }

          let label = currency.label ?? currency.ticker
          if (includeCurrencySymbols && currency.symbol) {
            label = symbolPosition === 'right' ? `${label} (${currency.symbol})` : `(${currency.symbol}) ${label}`
          }
          const option: SelectOption = {
            label,
            value: currency.ticker,
          }

          if ('icon' in currency) {
            option.icon = currency.icon
          }

          return option
        })
        .filter(Boolean) as SelectOption[]
    }, [defaultCurrencies, includeCurrencySymbols, symbolPosition, favoriteCurrencies])

    const favoriteOptions: SelectOption[] = useMemo(() => {
      const favoriteTickers = new Set(favoriteCurrencies)
      return defaultCurrencies
        .filter((currency) => favoriteTickers.has(currency.ticker))
        .map((currency) => {
          let label = currency.label ?? currency.ticker
          if (includeCurrencySymbols && currency.symbol) {
            label = symbolPosition === 'right' ? `${label} (${currency.symbol})` : `(${currency.symbol}) ${label}`
          }
          const option: SelectOption = {
            label,
            value: currency.ticker,
          }

          if ('icon' in currency) {
            option.icon = currency.icon
          }

          return option
        })
    }, [defaultCurrencies, favoriteCurrencies, includeCurrencySymbols, symbolPosition])

    const allOptions = [...favoriteOptions, ...options]
    const selectedLabel = allOptions.find((option) => option.value === internalValue)?.label ?? internalValue
    const baseLabel = allOptions.find((option) => option.value === baseValue)?.label ?? baseValue

    const handleChange = useCallback(
      (value: string | string[]) => {
        if (Array.isArray(value)) {
          console.warn('CurencyCodePicker received array value, expected string')
          return
        }
        setInternalValue(value)
        onChange?.(value)
      },
      [onChange]
    )

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    if (viewMode === 'edition') {
      return (
        <Select
          ref={ref}
          options={options}
          selectionIcon="checkmark"
          searchable={searchable}
          placeholder={placeholder}
          contentAlign={contentAlign}
          favoriteOptions={favoriteOptions}
          value={internalValue}
          onChange={handleChange}
          label={label}
          required={required}
          {...props}
        />
      )
    }

    return (
      <CurrencyCodePickerDiff
        value={selectedLabel}
        label={label}
        required={required}
        viewMode={viewMode}
        baseValue={baseLabel}
      />
    )
  }
)

CurrencyCodePicker.displayName = 'CurrencyCodePicker'

export { CurrencyCodePicker }
