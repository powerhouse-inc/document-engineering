import { OIDField } from '../../../scalars/components/oid-field/oid-field.js'
import type { OIDFieldProps } from '../../../scalars/components/oid-field/types.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildOidCellEditor = <T extends DataType>(
  oidFieldProps: Omit<
    OIDFieldProps,
    | 'name'
    | 'value'
    | 'onChange'
    | 'autoComplete'
    | 'fetchOptionsCallback'
    | 'fetchSelectedOptionCallback'
    | 'previewPlaceholder'
  >
) => {
  const OidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const oidValue = typeof value === 'string' ? value : String(value ?? '')

    return (
      <OIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        {...oidFieldProps}
        value={oidValue}
        onChange={(value: string) => {
          onChange(value)
        }}
      />
    )
  }

  return OidCellEditor
}
