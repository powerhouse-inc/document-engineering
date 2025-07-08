import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'

type PasswordInputWithDifference = Omit<WithDifference<string>, 'diffMode'>

interface PasswordInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      keyof InputBaseProps<string> | 'autoCorrect' | 'autoCapitalize' | 'spellCheck'
    >,
    InputBaseProps<string>,
    PasswordInputWithDifference {
  autoCorrect?: never
  autoCapitalize?: never
  spellCheck?: never
  // TODO: Implement commented props
  // requireUppercase?: boolean
  // requireLowercase?: boolean
  // requireNumbers?: boolean
  // requireSpecialCharacters?: boolean
  // disallowCommonPasswords?: boolean
  showPasswordStrength?: boolean
}

export type { PasswordInputProps }
