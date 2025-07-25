import type { InputHTMLAttributes } from 'react'
import type { InputBaseProps } from '../../../../scalars/components/types.js'

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'>,
    Omit<InputBaseProps<File>, 'warnings'> {
  allowedFileTypes?: string[]
  maxFileSize?: number
  dragAndDropEnabled?: boolean
}
