import { AIDField, type AIDFieldProps } from '../../../scalars/components/aid-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildAidCellEditor = <T extends DataType>(
  aidFieldProps: Omit<AIDFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const AidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const aidValue = normalizeStringValue(value)

    if (aidFieldProps.autoComplete !== false && aidFieldProps.fetchOptionsCallback) {
      const { autoComplete: _1, fetchOptionsCallback, ...restProps } = aidFieldProps

      return (
        <AIDField
          name={context.column.field}
          className="max-w-full"
          autoFocus
          fetchOptionsCallback={fetchOptionsCallback}
          {...restProps}
          value={aidValue}
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
    } = aidFieldProps

    return (
      <AIDField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        autoComplete={false}
        {...restProps}
        value={aidValue}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }

  return AidCellEditor
}
