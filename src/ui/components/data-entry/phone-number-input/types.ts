import type React from 'react'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { SelectProps } from '../select/types.js'

interface PhoneNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps<string>>,
    InputBaseProps<string>,
    Omit<WithDifference<string>, 'diffMode'> {
  allowedCountries?: string[]
  excludedCountries?: string[]
  includeDependentAreas?: boolean
  optionFormat?: 'CodesOnly' | 'NumbersOnly' | 'FlagsOnly' | 'FlagsAndCodes' | 'FlagsAndNumbers'
  selectProps?: Pick<SelectProps, 'placeholder' | 'searchable' | 'className' | 'contentClassName'>
}

export type { PhoneNumberInputProps }
