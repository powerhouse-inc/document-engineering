import { EmailInput } from '../../../ui/components/data-entry/email-input/index.js'
import type { EmailInputProps } from '../../../ui/components/data-entry/email-input/types.js'
import { validateFieldMatch } from '../../lib/validators/validateFieldMatch.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FieldErrorHandling } from '../types.js'
import { escapeIdForSelector, validateEmailDomain, validateEmailFormat } from './utils.js'

type EmailFieldProps = Omit<EmailInputProps, 'maxLength' | 'minLength'> &
  FieldErrorHandling & {
    allowedDomains?: string[]
    matchFieldName?: string
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
      ({ matchFieldName }) =>
      (value: string, formState: Record<string, unknown>) => {
        if (!matchFieldName) return true
        const currentField = document.querySelector(`input[name="${matchFieldName}"]`)
        const form = currentField?.closest('form')
        const formId = form?.id

        const matchFieldSelector = formId
          ? `#${escapeIdForSelector(formId)} input[name="${matchFieldName}"]`
          : `input[name="${matchFieldName}"]`
        const matchFieldElement = document.querySelector(matchFieldSelector)

        if (!matchFieldElement) return true

        const matchFieldLabel = matchFieldElement.getAttribute('data-label') ?? ''

        return validateFieldMatch(value, formState, {
          matchFieldName,
          errorMessage: `Email must match the ${matchFieldLabel} field`,
        })
      },
  },
})

EmailField.displayName = 'EmailField'

export { EmailField }
