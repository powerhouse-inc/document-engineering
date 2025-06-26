import { StringField } from '../../../../../scalars/components/string-field/string-field.js'
import type { CellContext, RenderCellEditorFn } from '../../types.js'

export const textCellEditor: RenderCellEditorFn<any, unknown> = (
  value: unknown,
  onChange: (newValue: unknown) => void,
  context: CellContext<unknown>
) => {
  const stringValue = typeof value === 'string' ? value : String(value ?? '')
  return (
    <StringField
      name={context.column.field}
      className="max-w-full"
      autoFocus
      value={stringValue}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    />
  )
}
