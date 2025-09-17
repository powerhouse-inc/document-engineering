import {
  DateTimePickerField,
  type DateTimePickerFieldProps,
} from '../../../scalars/components/date-time-picker-field/index.js'
import { normalizeDateValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildDateTimeCellEditor = <T extends DataType>(
  dateTimePickerFieldProps: Omit<DateTimePickerFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const DateTimeCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const dateTimeValue = normalizeDateValue(value)

    return (
      <DateTimePickerField
        name={context.column.field}
        className="max-w-full"
        {...dateTimePickerFieldProps}
        value={dateTimeValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return DateTimeCellEditor
}
