import { EmailField, type EmailFieldProps } from '../../../scalars/components/email-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildEmailCellEditor = <T extends DataType>(
  emailFieldProps: Omit<EmailFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const EmailCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const emailValue = normalizeStringValue(value)

    return (
      <EmailField
        name={context.column.field}
        className="max-w-full"
        autoFocus
        {...emailFieldProps}
        value={emailValue}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  }

  return EmailCellEditor
}
