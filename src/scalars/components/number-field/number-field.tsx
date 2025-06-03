import { validateNumericType } from './number-field-validations.js'
import { type NumberFieldProps, NumberInput } from '../../../ui/components/data-entry/number-input/number-input.js'
import { withFieldValidation } from '../fragments/with-field-validation/with-field-validation.js'

const NumberField = withFieldValidation<NumberFieldProps>(NumberInput, {
  validations: {
    _numericType: validateNumericType,
  },
})

NumberField.displayName = 'NumberField'
export { NumberField }
