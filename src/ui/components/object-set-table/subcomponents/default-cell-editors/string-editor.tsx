import { StringField, type StringFieldProps } from '../../../../../scalars/components/string-field/string-field.js'
import type { CellContext, DataType } from '../../types.js'

export const stringCellEditorFactory = <T extends DataType>(
  stringFieldProps: Omit<StringFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const StringCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const stringValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <StringField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...stringFieldProps}
        value={stringValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return StringCellEditor
}
