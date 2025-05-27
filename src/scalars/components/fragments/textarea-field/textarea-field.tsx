import {
  Textarea,
  type TextareaProps,
} from "../../../../ui/components/data-entry/textarea/index.js";
import type { FieldErrorHandling } from "../../types.js";
import { withFieldValidation } from "../with-field-validation/index.js";

interface TextareaFieldProps extends TextareaProps, FieldErrorHandling {}

const TextareaField = withFieldValidation<TextareaFieldProps>(Textarea);

TextareaField.displayName = "TextareaField";

export { TextareaField, type TextareaFieldProps };
