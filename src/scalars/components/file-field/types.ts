import type { FieldErrorHandling } from '../types.js'
import type { FileInputProps } from '../../../ui/components/data-entry/file-input/types.js'

export interface FileFieldProps extends Omit<FileInputProps, 'pattern'>, FieldErrorHandling {}
