import type { Amount } from '../../../ui/components/data-entry/amount-input/types.js'
import type { AmountFieldProps } from './types.js'

export const validateAmountCurrency =
  ({ type, required }: AmountFieldProps) =>
  (value: unknown) => {
    if (!value) {
      return required ? 'Please select a valid currency' : true
    }
    if (['AmountFiat', 'AmountCrypto', 'AmountCurrency'].includes(type)) {
      const actualUnit = (value as Amount).unit
      return required && !actualUnit ? 'Please select a valid currency' : true
    }

    if (type === 'Amount' && typeof value === 'object' && 'unit' in value) {
      const actualUnit = (value as Amount).unit
      return required && !actualUnit ? 'Please select a valid currency' : true
    }

    return true
  }
