import React, { useMemo } from 'react'
import { Select, type SelectOption } from '../select/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/index.js'
import { getCurrencies } from './utils.js'
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
      contentClassName,
      contentAlign = 'start',
      allowedTypes = 'Both',
      ...props
    },
    ref
  ) => {
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

    return (
      <FormGroup>
        <Select
          ref={ref}
          options={options}
          selectionIcon="checkmark"
          searchable={searchable}
          multiple={false}
          placeholder={placeholder}
          contentAlign={contentAlign}
          contentClassName={contentClassName}
          favoriteOptions={favoriteOptions}
          {...props}
        />
      </FormGroup>
    )
  }
)

CurrencyCodePicker.displayName = 'CurrencyCodePicker'

export { CurrencyCodePicker }
