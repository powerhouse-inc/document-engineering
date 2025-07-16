import { NumberField } from '../../../../../scalars/components/number-field/number-field.js'
import type { NumberFieldProps } from '../../../../../scalars/components/number-field/types.js'
import type { CellContext, DataType } from '../../types.js'

export const numberCellEditorFactory = <T extends DataType>(
  numberFieldProps: Omit<NumberFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const NumberCellEditor = (value: unknown, onChange: (newValue: unknown) => unknown, context: CellContext<T>) => {
    const numericValue = typeof value === 'number' ? value : Number(value) || 0

    return (
      <NumberField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...numberFieldProps}
        value={numericValue}
        onChange={(event) => {
          onChange(Number(event.target.value))
        }}
      />
    )
  }

  return NumberCellEditor
}
