import type { Currency } from '../currency-code-picker/types.js'

export interface Amount {
  value?: number
  unit?: CurrencyTicker
}

export type AmountPercentage = number | undefined
export type CurrencyTicker = Currency['ticker']

export interface AmountFiat {
  value?: number
  unit: CurrencyTicker
}

export interface AmountCrypto {
  value?: string
  unit: CurrencyTicker
}

export interface AmountCurrency {
  value?: string
  unit: CurrencyTicker
}

export type AmountInputPropsGeneric =
  | {
      type: 'Amount'
      value?: Amount
      defaultValue?: Amount
      trailingZeros?: boolean
    }
  | {
      type: 'AmountFiat'
      value?: AmountFiat
      defaultValue?: AmountFiat
      trailingZeros?: boolean
    }
  | {
      type: 'AmountPercentage'
      value?: AmountPercentage
      defaultValue?: AmountPercentage
      trailingZeros?: boolean
      units?: never
    }
  | {
      type: 'AmountCrypto'
      value?: AmountCrypto
      defaultValue?: AmountCrypto
      trailingZeros?: never
    }
  | {
      type: 'AmountCurrency'
      value?: AmountCurrency
      defaultValue?: AmountCurrency
      trailingZeros?: boolean
    }

export type AmountValue = Amount | AmountPercentage | AmountFiat | AmountCrypto | AmountCurrency
