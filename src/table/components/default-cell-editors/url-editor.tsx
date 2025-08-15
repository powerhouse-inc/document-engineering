import { UrlField, type UrlFieldProps } from '../../../scalars/components/url-field/url-field.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildUrlCellEditor = <T extends DataType>(
  urlFieldProps: Omit<UrlFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const UrlCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const urlValue = typeof value === 'string' ? value : (value?.toString() ?? '')

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
