import { UrlField, type UrlFieldProps } from '../../../scalars/components/url-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildUrlCellEditor = <T extends DataType>(
  urlFieldProps: Omit<UrlFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const UrlCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const urlValue = normalizeStringValue(value)

    return (
      <UrlField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...urlFieldProps}
        value={urlValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return UrlCellEditor
}
