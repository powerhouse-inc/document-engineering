import { NumberField } from '../../../../../scalars/components/number-field/number-field.js'
import type { CellContext, RenderCellEditorFn } from '../../types.js'

export const numberCellEditor: RenderCellEditorFn<any, unknown> = (
  value: unknown,
  onChange: (newValue: unknown) => unknown,
  context: CellContext<any>
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
