import { PHIDField, type PHIDFieldProps } from '../../../scalars/components/phid-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildPhidCellEditor = <T extends DataType>(
  phidFieldProps: Omit<PHIDFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const PhidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const phidValue = normalizeStringValue(value)

    if (phidFieldProps.autoComplete !== false && phidFieldProps.fetchOptionsCallback) {
      const { autoComplete: _1, fetchOptionsCallback, allowUris, allowedScopes, ...restProps } = phidFieldProps

      return (
        <PHIDField
          name={context.column.field}
          className="max-w-full"
          autoFocus
          fetchOptionsCallback={fetchOptionsCallback}
          {...(allowUris ? { allowUris: true, allowedScopes } : { allowUris: undefined })}
          {...restProps}
          value={phidValue}
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
      allowUris,
      allowedScopes,
      ...restProps
    } = phidFieldProps

    return (
      <PHIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        {...(allowUris ? { allowUris: true, allowedScopes } : { allowUris: undefined })}
        {...restProps}
        value={phidValue}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }

  return PhidCellEditor
}
