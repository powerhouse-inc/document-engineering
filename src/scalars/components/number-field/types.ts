import type { InputNumberProps } from '../../../ui/components/data-entry/number-input/types.js'
import type { FieldErrorHandling, WithDifference } from '../types.js'

export interface NumberFieldProps
  extends InputNumberProps,
    WithDifference<string | number | bigint>,
    FieldErrorHandling {}
