import { BooleanField, type BooleanFieldProps } from '../../../scalars/components/boolean-field/boolean-field.js'
import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildBooleanCellEditor = <T extends DataType>(
  booleanFieldProps: Omit<BooleanFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const BooleanCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const booleanValue = (() => {
      if (typeof value === 'boolean') {
        return value
      } else if (typeof value === 'string') {
        return value === 'true'
      }

      return Boolean(value)
    })()

    return (
      <div
        className={cn('flex [&_button]:!mr-0', {
          'justify-center': context.column.align === 'center',
          'justify-end': context.column.align === 'right',
        })}
      >
        <BooleanField
          autoFocus
          isToggle={false}
          name={context.column.field}
          {...booleanFieldProps}
          value={booleanValue}
          onChange={(value: boolean) => {
            onChange(value)
          }}
        />
      </div>
    )
  }

  return BooleanCellEditor
}
