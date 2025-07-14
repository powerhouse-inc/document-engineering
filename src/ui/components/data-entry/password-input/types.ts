import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'

interface PasswordInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      keyof InputBaseProps<string> | 'autoCorrect' | 'autoCapitalize' | 'spellCheck' | 'pattern'
    >,
    InputBaseProps<string>,
    Omit<WithDifference<string>, 'diffMode'> {
  autoCorrect?: never
  autoCapitalize?: never
  spellCheck?: never
  pattern?: RegExp
  showPasswordStrength?: boolean
  /**
   * Intended for exclusive use in Storybook stories to display the password strength popover open by default.
   */
  showPasswordStrengthOpen?: boolean
}

export type { PasswordInputProps }
