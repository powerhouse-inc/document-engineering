import { NumberInput } from '../../../data-entry/number-input/number-input.js'
import type { CellContext, RenderCellEditorFn } from '../../types.js'

export const numberCellEditor: RenderCellEditorFn<any, unknown> = (
  value: unknown,
  onChange: (newValue: unknown) => unknown,
  _context?: CellContext<any>
) => {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0

  return (
    <NumberInput
      name="cell-editor"
      className="max-w-full"
      autoFocus
      defaultValue={numericValue}
      onChange={(newValue) => {
        onChange(newValue)
      }}
    />
  )
}
