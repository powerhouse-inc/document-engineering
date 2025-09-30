import { CountryCodeField, type CountryCodeFieldProps } from '../../../scalars/components/country-code-field/index.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildCountryCellEditor = <T extends DataType>(
  countryFieldProps: Omit<CountryCodeFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const CountryCellEditor = (value: unknown, _onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const countryValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <CountryCodeField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...countryFieldProps}
        defaultValue={countryValue}
      />
    )
  }

  return CountryCellEditor
}
