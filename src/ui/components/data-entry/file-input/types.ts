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
  preview?: string
}

export type UploadFile = 'idle' | 'uploading' | 'success' | 'error'

export const PREVIEW_STATUS = {
  LOADING: 'loading',
  UNSUPPORTED_FILE: 'unsupported_file',
  CORRUPTED_FILE: 'corrupted_file',
  SUCCESS: 'success',
} as const

export type PreviewStatus = 'idle' | 'loading' | 'success' | 'corrupted_file' | 'unsupported_file'

export interface StatusConfig {
  icon: IconName | undefined
  title?: string
  message?: string
}

export type PreviewType = 'pdf' | 'image' | 'audio' | 'video'
