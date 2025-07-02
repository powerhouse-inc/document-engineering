import { EmailInput } from '../../../ui/components/data-entry/email-input/index.js'
import type { EmailInputProps } from '../../../ui/components/data-entry/email-input/types.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FieldErrorHandling } from '../types.js'

type EmailFieldProps = Omit<EmailInputProps, 'maxLength' | 'minLength'> & FieldErrorHandling & {}

const EmailField = withFieldValidation<EmailFieldProps>(EmailInput)

EmailField.displayName = 'EmailField'

export { EmailField }
