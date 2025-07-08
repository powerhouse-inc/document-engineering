import { EmailInput } from '../../../ui/components/data-entry/email-input/index.js'
import type { EmailInputProps } from '../../../ui/components/data-entry/email-input/types.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FieldErrorHandling } from '../types.js'
import { validateEmailDomain, validateEmailFormat } from './utils.js'

export type EmailFieldProps = Omit<EmailInputProps, 'maxLength' | 'minLength'> &
  FieldErrorHandling & {
    allowedDomains?: string[]
  }

const EmailField = withFieldValidation<EmailFieldProps>(EmailInput, {
  validations: {
    _validEmail: () => (value: string) => {
      if (!value) return true
      return validateEmailFormat(value)
    },
    _allowedDomains:
      ({ allowedDomains = [] }) =>
      (value: string) => {
        if (!value) return true
        return validateEmailDomain(value, { allowedDomains })
      },
  },
})

EmailField.displayName = 'EmailField'

export { EmailField }
