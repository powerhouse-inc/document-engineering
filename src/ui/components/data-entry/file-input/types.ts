import type { InputHTMLAttributes } from 'react'
import type { InputBaseProps } from '../../../../scalars/components/types.js'

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>,
    Omit<InputBaseProps<File>, 'warnings'> {
  allowedFileTypes?: string[]
  maxFileSize?: number
  dragAndDropEnabled?: boolean
  onChange?: (file: File | null) => void
  onCancel?: () => void
}

export type UploadFile = 'idle' | 'uploading' | 'success' | 'error'
