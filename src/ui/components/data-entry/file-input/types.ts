import type { InputHTMLAttributes } from 'react'
import type { InputBaseProps } from '../../../../scalars/components/types.js'
import type { IconName } from '../../../../index.js'

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
  showPreview?: boolean
}

export type UploadFile = 'idle' | 'uploading' | 'success' | 'error'

export const PREVIEW_STATUS = {
  LOADING: 'loading',
  UNSUPPORTED_FORMAT: 'unsupported_format',
  GENERIC_ERROR: 'generic_error',
  CORRUPTED_FILE: 'corrupted_file',
} as const

type ValueOf<T> = T[keyof T]
export type PreviewStatus = ValueOf<typeof PREVIEW_STATUS>

export interface StatusConfig {
  icon: IconName
  title: string
  message: string
}
