import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'

type PasswordInputWithDifference = Omit<WithDifference<string>, 'diffMode'>

interface PasswordInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      keyof InputBaseProps<string> | 'autoCorrect' | 'autoCapitalize' | 'spellCheck' | 'pattern'
    >,
    InputBaseProps<string>,
    PasswordInputWithDifference {
  autoCorrect?: never
  autoCapitalize?: never
  spellCheck?: never
  pattern?: RegExp
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialCharacters?: boolean
  // TODO: Implement disallowCommonPasswords
  // disallowCommonPasswords?: boolean
  showPasswordStrength?: boolean
  /**
   * Intended for exclusive use in Storybook stories to force the password strength popover to open by default.
   */
  showPasswordStrengthOpen?: boolean
}

export type { PasswordInputProps }
