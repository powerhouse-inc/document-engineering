import type React from 'react'
import type { InputBaseProps } from '../../../../scalars/components/types.js'

type CountryCodePickerBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<string> | 'onChange'
>

interface CountryCodePickerProps extends CountryCodePickerBaseProps, InputBaseProps<string> {
  onChange?: (value: string) => void
  placeholder?: string
  allowedCountries?: string[]
  excludedCountries?: string[]
  includeDependentAreas?: boolean
  viewMode?: 'CodesOnly' | 'NamesOnly' | 'NamesAndCodes'
  showFlagIcons?: boolean
  enableSearch?: boolean
}

export type { CountryCodePickerProps }
