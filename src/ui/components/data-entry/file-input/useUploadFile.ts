import { useCallback, useEffect, useState } from 'react'
import { PREVIEW_STATUS, type PreviewStatus } from './types.js'
import { detectPreviewType, validateAudio, validateImageHeader, validatePdfHeader, validateVideo } from './utils.js'

interface UseFileUploadProps {
  value?: File | null
  defaultValue?: File | null
  onChange?: (file: File | null) => void
}

const mapValidator = {
  ['pdf']: validatePdfHeader,
  ['image']: validateImageHeader,
  ['audio']: validateAudio,
  ['video']: validateVideo,
  ['unknown']: async () => Promise.resolve(false),
}

export const useFileUpload = ({ value, defaultValue, onChange }: UseFileUploadProps) => {
  const [file, setFile] = useState<File | null>(value ?? defaultValue ?? null)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>(PREVIEW_STATUS.LOADING)

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

  const typePreview = detectPreviewType(file?.type)

  const handleOnPreview = async () => {
    if (!file) return
    setIsPreviewOpen(true)
    setPreviewStatus(PREVIEW_STATUS.LOADING)

    if (typePreview === 'unknown') {
      setPreviewStatus(PREVIEW_STATUS.UNSUPPORTED_FORMAT)
      return
    }

    const validator = mapValidator[typePreview]

    try {
      const isValid = await validator(file)

      if (!isValid) {
        setPreviewStatus(PREVIEW_STATUS.CORRUPTED_FILE)
        return
      }

      if (!preview) {
        setPreviewStatus(PREVIEW_STATUS.CORRUPTED_FILE)
        return
      }
      await new Promise((res) => setTimeout(res, 2000))
      setPreviewStatus(PREVIEW_STATUS.SUCCESS)
    } catch {
      setPreviewStatus(PREVIEW_STATUS.CORRUPTED_FILE)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const borderIndicator = file ? 'text-blue-900' : 'text-gray-300'

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
    setPreviewStatus,
    typePreview,
  }
}
