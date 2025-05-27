import { DateTimePicker } from "../../../ui/components/data-entry/date-time-picker/date-time-picker.js";
import { withFieldValidation } from "../fragments/with-field-validation/with-field-validation.js";
import type { DateTimePickerFieldProps } from "./types.js";
import { dateTimeFieldValidations } from "./date-time-picker-field-validations.js";

const DateTimePickerField = withFieldValidation<DateTimePickerFieldProps>(
  DateTimePicker,
  {
    validations: {
      _dateTimePickerType: dateTimeFieldValidations,
    },
  },
);

DateTimePickerField.displayName = "DateTimePickerField";

export { DateTimePickerField };
