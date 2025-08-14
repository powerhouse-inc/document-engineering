import type React from 'react'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { SelectProps } from '../select/types.js'

type PrefixOptionFormat = 'CodesOnly' | 'FlagsOnly' | 'FlagsAndCodes' | 'FlagsAndNumbers'

interface PhoneNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps<string> | 'onChange'>,
    InputBaseProps<string>,
    Omit<WithDifference<string>, 'diffMode'> {
  onChange?: (value: string) => void
  allowedCountries?: string[]
  excludedCountries?: string[]
  includeDependentAreas?: boolean
  prefixOptionFormat?: PrefixOptionFormat
  prefixProps?: Pick<SelectProps, 'placeholder' | 'searchable' | 'className' | 'contentClassName'>
}

export type { PhoneNumberInputProps }
