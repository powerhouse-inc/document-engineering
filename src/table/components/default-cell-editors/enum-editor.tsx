import { SelectField, type SelectFieldProps } from '../../../scalars/components/fragments/select-field/index.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildEnumCellEditor = <T extends DataType>(
  selectFieldProps: Omit<SelectFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const EnumCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const enumValue = typeof value === 'string' ? value : (value?.toString() ?? '')

    if (selectFieldProps.selectionIcon === 'checkmark') {
      const { selectionIcon: _, selectionIconPosition, ...restProps } = selectFieldProps

      return (
        <SelectField
          name={context.column.field}
          className="max-w-full"
          autoFocus
          selectionIcon="checkmark"
          selectionIconPosition={selectionIconPosition}
          {...restProps}
          value={enumValue}
          onChange={(newValue) => {
            onChange(newValue)
          }}
        />
      )
    }

    const { selectionIcon: _1, selectionIconPosition: _2, ...restProps } = selectFieldProps

    return (
      <SelectField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...restProps}
        value={enumValue}
        onChange={(newValue) => {
          onChange(newValue)
        }}
      />
    )
  }

  return EnumCellEditor
}
