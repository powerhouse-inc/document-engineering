import { PhoneNumberField, type PhoneNumberFieldProps } from '../../../scalars/components/phone-number-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildPhoneCellEditor = <T extends DataType>(
  phoneNumberFieldProps: Omit<PhoneNumberFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const PhoneNumberCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const phoneValue = normalizeStringValue(value)

    return (
      <PhoneNumberField
        name={context.column.field}
        autoComplete="off"
        className="max-w-full"
        autoFocus
        {...phoneNumberFieldProps}
        value={phoneValue}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }

  return PhoneNumberCellEditor
}
