import { DatePickerField, type DatePickerFieldProps } from '../../../scalars/components/date-picker-field/index.js'
import { normalizeDateValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildDateCellEditor = <T extends DataType>(
  datePickerFieldProps: Omit<DatePickerFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const DateCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const dateValue = normalizeDateValue(value)

    return (
      <DatePickerField
        name={context.column.field}
        className="max-w-full"
        {...datePickerFieldProps}
        value={dateValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return DateCellEditor
}
