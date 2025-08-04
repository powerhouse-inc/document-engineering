import { useCallback, useState } from 'react'

interface UseFileUploadProps {
  value?: File | null
  defaultValue?: File | null
  onChange?: (file: File | null) => void
  onCancel?: () => void
}
export const useFileUpload = ({ value, defaultValue, onChange, onCancel }: UseFileUploadProps) => {
  const [file, setFile] = useState<File | null>(value ?? defaultValue ?? null)
  const handleDrop = useCallback(
    (acceptedFiles?: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setFile(file)
      onChange?.(file)
    },
    [onChange]
  )
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setFile(null)
      onChange?.(null)
      onCancel?.()
    },
    [onChange, onCancel]
  )

  const borderIndicator = file ? 'text-blue-900' : 'text-gray-300'

  return { handleDrop, onCancel, file, borderIndicator, handleCancel }
}
