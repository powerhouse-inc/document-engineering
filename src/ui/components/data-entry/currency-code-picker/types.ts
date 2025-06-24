import type React from 'react'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { SelectOption } from '../select/types.js'

type CurrencyCodePickerWithDifference = Omit<WithDifference<string>, 'diffMode'>

type AllowedTypes = 'Crypto' | 'Fiat' | 'Both'

interface Currency {
  ticker: string
  crypto: boolean
  label?: string
  symbol?: string
  icon?: SelectOption['icon']
}

type CurrencyCodePickerBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<string> | 'onChange'
>

interface CurrencyCodePickerProps
  extends CurrencyCodePickerWithDifference,
    CurrencyCodePickerBaseProps,
    InputBaseProps<string> {
  placeholder?: string
  onChange?: (value: string) => void
  currencies?: Currency[]
  includeCurrencySymbols?: boolean
  favoriteCurrencies?: string[]
  symbolPosition?: 'left' | 'right'
  searchable?: boolean
  contentClassName?: string
  contentAlign?: 'start' | 'end' | 'center'
  allowedTypes?: AllowedTypes
}

export type { AllowedTypes, Currency, CurrencyCodePickerProps, CurrencyCodePickerWithDifference }
