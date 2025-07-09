import { PasswordInput } from '../../../ui/components/data-entry/password-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import { specialCharacters } from '../../lib/utils.js'
import type { PasswordFieldProps } from './types.js'

const PasswordField = withFieldValidation<PasswordFieldProps>(PasswordInput, {
  validations: {
    _requireUppercase:
      ({ requireUppercase = true }) =>
      (value: string | undefined) => {
        if (!requireUppercase || value === '' || value === undefined) {
          return true
        }
        return /[A-Z]/.test(value) || 'The field value must contain at least one uppercase letter'
      },
    _requireLowercase:
      ({ requireLowercase = true }) =>
      (value: string | undefined) => {
        if (!requireLowercase || value === '' || value === undefined) {
          return true
        }
        return /[a-z]/.test(value) || 'The field value must contain at least one lowercase letter'
      },
    _requireNumbers:
      ({ requireNumbers = true }) =>
      (value: string | undefined) => {
        if (!requireNumbers || value === '' || value === undefined) {
          return true
        }
        return /[0-9]/.test(value) || 'The field value must contain at least one number'
      },
    _requireSpecialCharacters:
      ({ requireSpecialCharacters = true }) =>
      (value: string | undefined) => {
        if (!requireSpecialCharacters || value === '' || value === undefined) {
          return true
        }
        for (const char of specialCharacters) {
          if (value.includes(char)) {
            return true
          }
        }
        return `The field value must contain at least one special character from the list between double quotes: "${specialCharacters}"`
      },
  },
})

PasswordField.displayName = 'PasswordField'

export { PasswordField }
