'use client'

import { AmountInput } from '../../../ui/components/data-entry/amount-input/amount-input.js'
import { withFieldValidation } from '../fragments/with-field-validation/with-field-validation.js'
import type { AmountFieldProps } from './types.js'
import { validateAmountCurrency } from './amount-currency-validations.js'
import { validateAmount } from './amount-field-validations.js'

const AmountField = withFieldValidation<AmountFieldProps>(AmountInput, {
  validations: {
    _numericAmount: validateAmount,
    _validOptionCurrency: validateAmountCurrency,
  },
})

AmountField.displayName = 'AmountField'

export { AmountField }
