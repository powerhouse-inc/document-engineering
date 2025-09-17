import { StringField, type StringFieldProps } from '../../../scalars/components/string-field/index.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildStringCellEditor = <T extends DataType>(
  stringFieldProps: Omit<StringFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const StringCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const stringValue = typeof value === 'string' ? value : (value?.toString() ?? '')

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
