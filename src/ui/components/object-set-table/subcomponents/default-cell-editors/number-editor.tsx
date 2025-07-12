import { NumberField } from '../../../../../scalars/components/number-field/number-field.js'
import type { CellContext, DataType } from '../../types.js'

export const numberCellEditor = <T extends DataType>(
  value: unknown,
  onChange: (newValue: unknown) => unknown,
  context: CellContext<T>
) => {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0

  return (
    <NumberField
      name={context.column.field}
      className="max-w-full"
      autoFocus
      value={numericValue}
      onChange={(event) => {
        onChange(Number(event.target.value))
      }}
    />
  )
}
