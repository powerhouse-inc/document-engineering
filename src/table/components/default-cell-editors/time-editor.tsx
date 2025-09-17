import { type TimeFieldProps, TimePickerField } from '../../../scalars/components/time-picker-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildTimeCellEditor = <T extends DataType>(
  timeFieldProps: Omit<TimeFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const TimeCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const timeValue = normalizeStringValue(value)

    return (
      <TimePickerField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...timeFieldProps}
        value={timeValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return TimeCellEditor
}
