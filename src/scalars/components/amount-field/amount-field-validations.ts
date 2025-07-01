import type { ValidatorResult } from '../../../scalars/components/types.js'
import type {
  Amount,
  AmountCrypto,
  AmountCurrency,
  AmountFiat,
  AmountInputPropsGeneric,
  AmountValue,
} from '../../../ui/components/data-entry/amount-input/types.js'
import { isValidBigInt } from '../../../ui/components/data-entry/amount-input/utils.js'
import { isValidNumber } from '../number-field/number-field-validations.js'
import type { AmountFieldProps } from './types.js'

const isAmountCurrencyFiat = (type: AmountInputPropsGeneric['type']): type is 'AmountFiat' => type === 'AmountFiat'

const isAmountCurrencyCrypto = (type: AmountInputPropsGeneric['type']): type is 'AmountCrypto' =>
  type === 'AmountCrypto'

const isAmountCurrencyUniversal = (type: AmountInputPropsGeneric['type']): type is 'AmountCurrency' =>
  type === 'AmountCurrency'

const isAmount = (type: AmountInputPropsGeneric['type']): type is 'Amount' => type === 'Amount'

const getAmount = (value: AmountValue, type: AmountInputPropsGeneric['type']): number | string | undefined => {
  if (isAmountCurrencyFiat(type) || isAmountCurrencyCrypto(type) || isAmountCurrencyUniversal(type) || isAmount(type)) {
    if (!value) return undefined
    const amount = (value as AmountFiat | AmountCrypto | AmountCurrency | Amount).amount ?? undefined
    return amount
  }
  return value as number
}

export const validateAmount =
  ({ type, minValue, maxValue, allowNegative, required }: AmountFieldProps) =>
  (value: unknown): ValidatorResult => {
    const amount = getAmount(value as AmountValue, type)
    if (amount === '' || amount === undefined) {
      return required ? 'Please enter a valid number' : true
    }

    // This case are types that are strings but hndle as bigint
    if (type === 'AmountCurrency' || type === 'AmountCrypto') {
      if (!isValidBigInt(amount.toString())) {
        return 'Value is not an bigint'
      }

      if (!allowNegative && BigInt(amount) < 0) {
        return 'Value must be positive'
      }
      if (maxValue) {
        if (BigInt(amount) > BigInt(maxValue)) {
          return `This field must be less than ${maxValue}`
        }
      }
      if (minValue) {
        if (BigInt(amount) < BigInt(minValue)) {
          return `This field must be more than ${minValue}`
        }
      }
      return true
    }

    if (Math.abs(Number(amount.toString())) > Number.MAX_SAFE_INTEGER) {
      return 'Value is too large for number'
    }
    if (!isValidNumber(amount)) {
      return 'Value is not a valid number'
    }
    if (!allowNegative && Number(amount) < 0) {
      return 'Value must be positive'
    }
    if (maxValue) {
      if (Number(amount) > maxValue) {
        return `This field must be less than ${maxValue}`
      }
    }
    if (minValue) {
      if (Number(amount) < minValue) {
        return `This field must be more than ${minValue}`
      }
    }
    return true
  }
