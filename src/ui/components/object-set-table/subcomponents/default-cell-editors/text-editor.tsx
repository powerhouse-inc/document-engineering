import { StringField } from '../../../../../scalars/components/string-field/string-field.js'
import type { CellContext, DataType } from '../../types.js'

export const textCellEditor = <T extends DataType>(
  value: unknown,
  onChange: (newValue: unknown) => void,
  context: CellContext<T>
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
