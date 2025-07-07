import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { InputHTMLAttributes } from 'react'

export interface EmailInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'defaultValue' | 'autoComplete' | 'pattern' | 'minLength' | 'maxLength'
    >,
    Omit<WithDifference<string>, 'diffMode'>,
    InputBaseProps<string> {
  placeholder?: string
  autoComplete?: boolean
}
