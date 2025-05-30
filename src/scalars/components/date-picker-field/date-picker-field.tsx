import { DatePicker } from '../../../ui/components/data-entry/date-picker/date-picker.js'
import { withFieldValidation } from '../fragments/with-field-validation/with-field-validation.js'
import type { DatePickerFieldProps } from './types.js'
import { validateDatePicker } from './date-picker-validations.js'

const DatePickerField = withFieldValidation<DatePickerFieldProps>(DatePicker, {
  validations: {
    _datePickerType: validateDatePicker,
  },
})

DatePickerField.displayName = 'DatePickerField'

export { DatePickerField }
