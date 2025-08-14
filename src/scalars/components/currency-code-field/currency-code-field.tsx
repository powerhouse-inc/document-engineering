'use client'

import { CurrencyCodePicker } from '../../../ui/components/data-entry/currency-code-picker/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { CurrencyCodeFieldProps } from './types.js'

const CurrencyCodeField = withFieldValidation<CurrencyCodeFieldProps>(CurrencyCodePicker)

CurrencyCodeField.displayName = 'CurrencyCodeField'

export { CurrencyCodeField }
