import { useCallback, useEffect, useState } from 'react'
import { detectPreviewType, getPreviewComponentFromError, validateFileForPreview } from './utils.js'
import useFetchQuery from './useFetchQuery.js'
import type { PreviewStatus } from './types.js'

interface UseFileUploadProps {
  value?: File | null
  defaultValue?: File | null
  onChange?: (file: File | null) => void
}

export const useFileUpload = ({ value, defaultValue, onChange }: UseFileUploadProps) => {
  const [file, setFile] = useState<File | null>(value ?? defaultValue ?? null)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const queryFn = useCallback(async () => {
    if (!file) return Promise.reject(new Error('No hay archivo seleccionado'))
    return validateFileForPreview(file)
  }, [file])
  const { data, isLoading, error } = useFetchQuery(queryFn, {
    enabled: isPreviewOpen && !!file,
  })

  const getPreviewStatus = (): PreviewStatus => {
    if (!isPreviewOpen) return 'idle'
    if (isLoading) return 'loading'
    if (error) {
      const errorType = getPreviewComponentFromError(error)
      return errorType || 'unsupported_file'
    }
    if (data === 'success') return 'success'
    return 'idle'
  }
  const previewStatus = getPreviewStatus()

  const handleDrop = useCallback(
    (acceptedFiles?: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      const preview = URL.createObjectURL(file)
      setPreview(preview)
      setFile(file)
      onChange?.(file)
    },
    [onChange]
  )

  const handleCancelPreview = () => {
    setIsPreviewOpen(false)
  }

  const typePreview = detectPreviewType(file ?? undefined)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const borderIndicator = file ? 'text-blue-900' : 'text-gray-300'

  const handleOnPreview = () => {
    if (!file) return
    setIsPreviewOpen(true)
  }

  return {
    handleDrop,
    file,
    borderIndicator,
    // Preview
    preview,
    handleCancelPreview,
    handleOnPreview,
    isPreviewOpen,
    previewStatus,
    typePreview,
  }
}
