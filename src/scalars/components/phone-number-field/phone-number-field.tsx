'use client'

import { PhoneNumberInput } from '../../../ui/components/data-entry/phone-number-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { PhoneNumberFieldProps } from './types.js'

const PhoneNumberField = withFieldValidation<PhoneNumberFieldProps>(PhoneNumberInput, {
  validations: {
    _validFormat: () => (value: string | undefined) => {
      if (value === '' || value === undefined) {
        return true
      }

      // TODO: implement validation
      return true
    },
  },
})

PhoneNumberField.displayName = 'PhoneNumberField'

export { PhoneNumberField }
