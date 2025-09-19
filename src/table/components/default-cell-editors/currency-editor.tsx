import {
  CurrencyCodeField,
  type CurrencyCodeFieldProps,
} from '../../../scalars/components/currency-code-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildCurrencyCellEditor = <T extends DataType>(
  currencyFieldProps: Omit<CurrencyCodeFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const CurrencyCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const currencyValue = normalizeStringValue(value)

    return (
      <CurrencyCodeField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...currencyFieldProps}
        value={currencyValue}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }

  return CurrencyCellEditor
}
