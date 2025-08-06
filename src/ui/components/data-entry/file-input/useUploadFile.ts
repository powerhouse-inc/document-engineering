import { useCallback, useState } from 'react'

interface UseFileUploadProps {
  value?: File | null
  defaultValue?: File | null
  onChange?: (file: File | null) => void
}
export const useFileUpload = ({ value, defaultValue, onChange }: UseFileUploadProps) => {
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

  const borderIndicator = file ? 'text-blue-900' : 'text-gray-300'

  return { handleDrop, file, borderIndicator }
}
