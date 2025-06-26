import { Checkbox } from '../../../data-entry/checkbox/checkbox.js'
import type { CellContext, RenderCellEditorFn } from '../../types.js'

export const booleanCellEditor: RenderCellEditorFn<any, unknown> = (
  value: unknown,
  onChange: (newValue: unknown) => void,
  _context?: CellContext<any>
) => {
  const booleanValue = Boolean(value)

  return (
    <Checkbox
      autoFocus
      defaultValue={booleanValue}
      onChange={(checked: boolean) => {
        onChange(checked)
      }}
    />
  )
}
