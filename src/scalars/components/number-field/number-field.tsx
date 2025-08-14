'use client'

import { validateNumericType } from './number-field-validations.js'
import { NumberInput } from '../../../ui/components/data-entry/number-input/number-input.js'
import { withFieldValidation } from '../fragments/with-field-validation/with-field-validation.js'
import type { NumberFieldProps } from './types.js'

const NumberField = withFieldValidation<NumberFieldProps>(NumberInput, {
  validations: {
    _numericType: validateNumericType,
  },
})

NumberField.displayName = 'NumberField'
export { NumberField, NumberFieldProps }
