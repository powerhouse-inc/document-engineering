import type { ValidatorResult } from '../../components/types.js'

export interface MatchFieldValidationOptions {
  matchFieldName?: string
  errorMessage?: string
  matchFieldLabelError?: string
}

/**
 * Validates if a field value matches another field in the form
 * @param value - The current field value
 * @param formState - The complete form state
 * @param options - Validation options containing the field name to match and optional error message
 * @returns true if valid, error message if invalid
 */
export const validateFieldMatch = (
  value: string,
  formState: Record<string, unknown>,
  options: MatchFieldValidationOptions
): ValidatorResult => {
  const { matchFieldName, errorMessage, matchFieldLabelError } = options

  if (!matchFieldName) return true

  const targetValue = formState[matchFieldName] as string
  if (value !== targetValue) {
    return errorMessage ?? `Field must match the ${matchFieldLabelError} field`
  }

  return true
}
