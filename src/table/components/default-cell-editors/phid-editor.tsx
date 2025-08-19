import { PHIDField } from '../../../scalars/components/phid-field/phid-field.js'
import type { PHIDFieldProps } from '../../../scalars/components/phid-field/types.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildPhidCellEditor = <T extends DataType>(
  phidFieldProps: Omit<
    PHIDFieldProps,
    | 'name'
    | 'value'
    | 'onChange'
    | 'autoComplete'
    | 'allowUris'
    | 'allowedScopes'
    | 'fetchOptionsCallback'
    | 'fetchSelectedOptionCallback'
    | 'previewPlaceholder'
  >
) => {
  const PhidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const phidValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <PHIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        allowUris={false}
        {...phidFieldProps}
        value={phidValue}
        onChange={(value: string) => {
          onChange(value)
        }}
      />
    )
  }

  return PhidCellEditor
}
