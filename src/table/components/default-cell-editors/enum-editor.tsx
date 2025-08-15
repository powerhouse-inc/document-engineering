import { SelectField, type SelectFieldProps } from '../../../scalars/components/fragments/select-field/index.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildEnumCellEditor = <T extends DataType>(
  selectFieldProps: Omit<SelectFieldProps, 'name' | 'value' | 'onChange' | 'selectionIcon' | 'selectionIconPosition'>
) => {
  const EnumCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const enumValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <SelectField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...selectFieldProps}
        value={enumValue}
        onChange={(newValue) => {
          onChange(newValue)
        }}
      />
    )
  }

  return EnumCellEditor
}
