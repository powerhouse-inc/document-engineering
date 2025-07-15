import type { PasswordInputProps } from '../../../ui/components/data-entry/password-input/types.js'
import type { FieldErrorHandling } from '../types.js'

type PasswordFieldProps = PasswordInputProps &
  FieldErrorHandling & {
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialCharacters?: boolean
    matchFieldName?: string
  }

export type { PasswordFieldProps }
