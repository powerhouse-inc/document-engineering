import React from 'react'
import { PasswordInput } from '../../../ui/components/data-entry/password-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import { specialCharacters } from '../../../ui/components/data-entry/password-input/utils.js'
import type { PasswordFieldProps } from './types.js'

const PasswordInputWrapper = React.forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  const {
    requireUppercase: _1,
    requireLowercase: _2,
    requireNumbers: _3,
    requireSpecialCharacters: _4,
    matchFieldName,
    ...rest
  } = props

  return <PasswordInput ref={ref} {...rest} {...(!!matchFieldName && { 'data-exclude': 'true' })} />
})
PasswordInputWrapper.displayName = 'PasswordInputWrapper'

const PasswordField = withFieldValidation<PasswordFieldProps>(PasswordInputWrapper, {
  validations: {
    _requireUppercase:
      ({ requireUppercase = true }) =>
      (value: string | undefined) => {
        if (!requireUppercase || value === '' || value === undefined) {
          return true
        }
        return /[A-Z]/.test(value) || 'This field must contain at least one uppercase letter'
      },
    _requireLowercase:
      ({ requireLowercase = true }) =>
      (value: string | undefined) => {
        if (!requireLowercase || value === '' || value === undefined) {
          return true
        }
        return /[a-z]/.test(value) || 'This field must contain at least one lowercase letter'
      },
    _requireNumbers:
      ({ requireNumbers = true }) =>
      (value: string | undefined) => {
        if (!requireNumbers || value === '' || value === undefined) {
          return true
        }
        return /[0-9]/.test(value) || 'This field must contain at least one number'
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
        return `This field must contain at least one special character: ${specialCharacters}`
      },
    _matchPassword:
      ({ matchFieldName }) =>
      (value: string, formState: Record<string, unknown>) => {
        if (!matchFieldName) return true

        if (value !== formState[matchFieldName]) {
          const matchFieldElements = document.querySelectorAll(`input[name="${matchFieldName}"]`)

          if (matchFieldElements.length === 1) {
            const matchFieldLabel = matchFieldElements[0].getAttribute('data-label')
            if (matchFieldLabel) {
              return `Password must match the "${matchFieldLabel}" field`
            }
          }
          return 'Password does not match'
        }

        return true
      },
  },
})

PasswordField.displayName = 'PasswordField'

export { PasswordField }
