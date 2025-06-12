import type React from 'react'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'

type CountryCodePickerWithDifference = Omit<WithDifference<string>, 'diffMode'>

type CountryCodePickerBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<string> | 'onChange'
>

interface CountryCodePickerProps
  extends CountryCodePickerWithDifference,
    CountryCodePickerBaseProps,
    InputBaseProps<string> {
  onChange?: (value: string) => void
  placeholder?: string
  allowedCountries?: string[]
  excludedCountries?: string[]
  includeDependentAreas?: boolean
  optionFormat?: 'CodesOnly' | 'NamesOnly' | 'NamesAndCodes'
  showFlagIcons?: boolean
  enableSearch?: boolean
}

export type { CountryCodePickerProps, CountryCodePickerWithDifference }
