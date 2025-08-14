'use client'

import { TimePicker } from '../../../ui/components/data-entry/time-picker/time-picker.js'
import { withFieldValidation } from '../fragments/with-field-validation/with-field-validation.js'
import type { TimeFieldProps } from './types.js'
import { validateTimePicker } from './time-picker-field-validations.js'

const TimePickerField = withFieldValidation<TimeFieldProps>(TimePicker, {
  validations: {
    _timePickerType: validateTimePicker,
  },
})

TimePickerField.displayName = 'TimePickerField'

export { TimePickerField }
