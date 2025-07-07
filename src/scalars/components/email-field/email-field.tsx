import { EmailInput } from '../../../ui/components/data-entry/email-input/index.js'
import type { EmailInputProps } from '../../../ui/components/data-entry/email-input/types.js'
import { validateFieldMatch } from '../../lib/validators/validateFieldMatch.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FieldErrorHandling } from '../types.js'
import { validateEmailDomain, validateEmailFormat } from './utils.js'

type EmailFieldProps = Omit<EmailInputProps, 'maxLength' | 'minLength'> &
  FieldErrorHandling & {
    allowedDomains?: string[]
    matchFieldName?: string
    matchFieldLabelError?: string
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
    _matchEmail:
      ({ matchFieldName, matchFieldLabelError }) =>
      (value: string, formState: Record<string, unknown>) => {
        return validateFieldMatch(value, formState, {
          matchFieldName,
          errorMessage: `Email must match the ${matchFieldLabelError} field`,
          matchFieldLabelError,
        })
      },
  },
})

EmailField.displayName = 'EmailField'

export { EmailField }
