import { AIDField } from '../../../scalars/components/aid-field/aid-field.js'
import type { AIDFieldProps } from '../../../scalars/components/aid-field/types.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildAidCellEditor = <T extends DataType>(
  aidFieldProps: Omit<AIDFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const AidCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const aidValue = typeof value === 'string' ? value : (value?.toString() ?? '')

    if (aidFieldProps.autoComplete !== false && aidFieldProps.fetchOptionsCallback) {
      const { autoComplete: _, fetchOptionsCallback, ...restProps } = aidFieldProps

      return (
        <AIDField
          name={context.column.field}
          className="max-w-full"
          autoFocus
          fetchOptionsCallback={fetchOptionsCallback}
          {...restProps}
          value={aidValue}
          onChange={(value: string) => {
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
        onChange={(value: string) => {
          onChange(value)
        }}
      />
    )
  }

  return AidCellEditor
}
