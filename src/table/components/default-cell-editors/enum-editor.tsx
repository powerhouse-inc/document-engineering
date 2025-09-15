import { SelectField, type SelectFieldProps } from '../../../scalars/components/fragments/select-field/index.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildEnumCellEditor = <T extends DataType>(
  selectFieldProps: Omit<SelectFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const EnumCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const enumValue = typeof value === 'string' ? value : (value?.toString() ?? '')

    const props = {
      name: context.column.field,
      className: 'max-w-full',
      autoFocus: true,
      ...selectFieldProps,
      value: enumValue,
      onChange: (newValue: string | string[]) => {
        onChange(newValue)
      },
    }

    return <SelectField {...(props as SelectFieldProps)} />
  }

  return EnumCellEditor
}
