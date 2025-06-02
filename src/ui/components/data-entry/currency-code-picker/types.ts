import type React from 'react'
import type { IconName } from '../../icon/index.js'
import type { InputBaseProps } from '../../../../scalars/components/types.js'

type AllowedTypes = 'Crypto' | 'Fiat' | 'Both'

interface Currency {
  ticker: string
  crypto: boolean
  label?: string
  symbol?: string
  icon?: IconName | React.ComponentType<{ className?: string }>
}

type CurrencyCodePickerBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<string | string[]> | 'onChange' | 'onBlur'
>

interface CurrencyCodePickerProps extends CurrencyCodePickerBaseProps, InputBaseProps<string | string[]> {
  placeholder?: string
  onChange?: (value: string | string[]) => void
  onBlur?: () => void
  currencies?: Currency[]
  includeCurrencySymbols?: boolean
  favoriteCurrencies?: string[]
  symbolPosition?: 'left' | 'right'
  searchable?: boolean
  contentClassName?: string
  contentAlign?: 'start' | 'end' | 'center'
  allowedTypes?: AllowedTypes
}

export type { AllowedTypes, Currency, CurrencyCodePickerProps }
