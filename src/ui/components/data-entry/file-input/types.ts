import type { InputHTMLAttributes } from 'react'
import type { InputBaseProps } from '../../../../scalars/components/types.js'

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>,
    InputBaseProps<File> {
  allowedFileTypes?: string[]
  maxFileSize?: number
  dragAndDropEnabled?: boolean
  onChange?: (file: File | null) => void
  // Item Props
  fileName?: string
  mimeType?: string
  fileSize?: number
  progress?: number
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onReload?: (e: React.MouseEvent<HTMLButtonElement>) => void
  errorsUpload?: string[]
  status?: UploadFile
  onPreview?: () => void
}

export type UploadFile = 'idle' | 'uploading' | 'success' | 'error'
