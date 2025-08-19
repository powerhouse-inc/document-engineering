'use client'

import parsePhoneNumber from 'libphonenumber-js'
import { PhoneNumberInput } from '../../../ui/components/data-entry/phone-number-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { PhoneNumberFieldProps } from './types.js'

const PhoneNumberField = withFieldValidation<PhoneNumberFieldProps>(PhoneNumberInput, {
  validations: {
    _validFormat: () => (value: string | undefined) => {
      if (value === '' || value === undefined) {
        return true
      }

      const errorMessage =
        'Invalid phone number format. Please enter a valid phone number formatted according to the ITU-T E.164 recommendation, e.g. +14155552671'

      // check basic regex pattern
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(value)) {
        return errorMessage
      }

      // validate using libphonenumber-js
      const withPlusValue = `${value.startsWith('+') ? '' : '+'}${value}`
      const parsedValue = parsePhoneNumber(withPlusValue, { extract: false })

      if (parsedValue?.isPossible() && parsedValue.country) {
        const expectedValue = `+${parsedValue.countryCallingCode}${parsedValue.nationalNumber}`
        if (withPlusValue !== expectedValue) {
          return errorMessage
        }
        return true
      }

      return errorMessage
    },
  },
})

PhoneNumberField.displayName = 'PhoneNumberField'

export { PhoneNumberField }
