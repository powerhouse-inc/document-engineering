import { EmailField, type EmailFieldProps } from '../../../scalars/components/email-field/email-field.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildEmailCellEditor = <T extends DataType>(
  emailFieldProps: Omit<EmailFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const EmailCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const emailValue = typeof value === 'string' ? value : String(value ?? '')

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
