import { AIDField } from '../../../scalars/components/aid-field/aid-field.js'
import type { AIDFieldProps } from '../../../scalars/components/aid-field/types.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildAidCellEditor = <T extends DataType>(
  aidFieldProps: Omit<
    AIDFieldProps,
    | 'name'
    | 'value'
    | 'onChange'
    | 'autoComplete'
    | 'fetchOptionsCallback'
    | 'fetchSelectedOptionCallback'
    | 'previewPlaceholder'
  >
) => {
  const AidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const aidValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <AIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        {...aidFieldProps}
        value={aidValue}
        onChange={(value: string) => {
          onChange(value)
        }}
      />
    )
  }

  return AidCellEditor
}
