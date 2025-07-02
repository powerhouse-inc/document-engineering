import type { InputBaseProps } from '../../../../scalars/components/types.js'
import type { InputHTMLAttributes } from 'react'

export interface EmailInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'defaultValue' | 'autoComplete' | 'pattern' | 'minLength' | 'maxLength'
    >,
    InputBaseProps<string> {
  placeholder?: string
  autoComplete?: boolean
}
