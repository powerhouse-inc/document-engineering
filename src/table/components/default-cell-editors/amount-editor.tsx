import { AmountField, type AmountFieldProps } from '../../../scalars/components/amount-field/index.js'
import type { Amount } from '../../../ui/components/data-entry/amount-input/types.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildAmountCellEditor = <T extends DataType>(
  amountFieldProps: Omit<AmountFieldProps, 'name' | 'value' | 'onChange' | 'type' | 'defaultValue'>
) => {
  const AmountCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    // Convert value to Amount type if it's not already
    const amountValue =
      typeof value === 'object' && value !== null && 'value' in value
        ? value
        : { value: typeof value === 'number' ? value : undefined }

    return (
      <AmountField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        type="Amount"
        {...amountFieldProps}
        value={amountValue as Amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return AmountCellEditor
}
