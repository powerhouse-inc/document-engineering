'use client'

import React from 'react'
import { EmailInput } from '../../../ui/components/data-entry/email-input/index.js'
import type { EmailInputProps } from '../../../ui/components/data-entry/email-input/types.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FieldErrorHandling } from '../types.js'
import { validateEmailDomain, validateEmailFormat } from './utils.js'

export type EmailFieldProps = Omit<EmailInputProps, 'maxLength' | 'minLength'> &
  FieldErrorHandling & {
    allowedDomains?: string[]
    matchFieldName?: string
    maxLength?: number
    minLength?: number
  }

const EmailInputWrapper = React.forwardRef<HTMLInputElement, EmailFieldProps>((props, ref) => {
  const { allowedDomains: _1, matchFieldName, ...rest } = props

  return <EmailInput ref={ref} {...rest} {...(!!matchFieldName && { 'data-exclude': 'true' })} />
})
EmailInputWrapper.displayName = 'EmailInputWrapper'

const EmailField = withFieldValidation<EmailFieldProps>(EmailInputWrapper, {
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

        if (value !== formState[matchFieldName]) {
          const matchFieldElements = document.querySelectorAll(`input[name="${matchFieldName}"]`)
          if (matchFieldElements.length === 1) {
            const matchFieldLabel = matchFieldElements[0].getAttribute('data-label')
            if (matchFieldLabel) {
              return `Email must match the "${matchFieldLabel}" field`
            }
          }
          return 'Email does not match'
        }

        return true
      },
  },
})

EmailField.displayName = 'EmailField'

export { EmailField }
