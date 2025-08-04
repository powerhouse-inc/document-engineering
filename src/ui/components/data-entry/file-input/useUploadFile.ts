import { useCallback, useState } from 'react'

interface UseFileUploadProps {
  value?: File
  defaultValue?: File
  onChange?: (file: File | null) => void
}
export const useFileUpload = ({ onChange }: UseFileUploadProps) => {
  const [file, setFile] = useState<File | null>(null)

  const onHandleDrop = useCallback(
    (acceptedFiles?: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setFile(file)
      onChange?.(file)
    },
    [onChange]
  )
  const onCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setFile(null)
  }, [])

  const borderIndicator = file ? 'text-blue-900' : 'text-gray-300'

  return { onHandleDrop, onCancel, file, borderIndicator }
}
