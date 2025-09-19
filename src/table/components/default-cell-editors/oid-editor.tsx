import { OIDField, type OIDFieldProps } from '../../../scalars/components/oid-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildOidCellEditor = <T extends DataType>(
  oidFieldProps: Omit<OIDFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const OidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const oidValue = normalizeStringValue(value)

    if (oidFieldProps.autoComplete !== false && oidFieldProps.fetchOptionsCallback) {
      const { autoComplete: _1, fetchOptionsCallback, ...restProps } = oidFieldProps

      return (
        <OIDField
          name={context.column.field}
          className="max-w-full"
          autoFocus
          fetchOptionsCallback={fetchOptionsCallback}
          {...restProps}
          value={oidValue}
          onChange={(value) => {
            onChange(value)
          }}
        />
      )
    }

    const {
      autoComplete: _1,
      fetchOptionsCallback: _2,
      fetchSelectedOptionCallback: _3,
      previewPlaceholder: _4,
      ...restProps
    } = oidFieldProps

    return (
      <OIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        {...restProps}
        value={oidValue}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }

  return OidCellEditor
}
