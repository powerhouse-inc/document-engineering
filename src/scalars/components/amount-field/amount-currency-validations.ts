import type { AmountFieldProps } from './types.js'

export const validateAmountCurrency =
  ({ type, required }: AmountFieldProps) =>
  (value: unknown) => {
    if (!value) return true
    if (typeof value === 'object' && 'unit' in value) {
      if (['AmountFiat', 'AmountCrypto', 'AmountCurrency', 'Amount'].includes(type)) {
        const actualUnit = value.unit
        if (!actualUnit) {
          return required ? 'Please select a valid currency' : true
        }
        return true
      }
      return true
    }
    return true
  }
