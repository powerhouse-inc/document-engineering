import { type DragEvent, useCallback, useState } from 'react'

export interface FileUploadOptions {
  value?: File
  defaultValue?: File
}

export const useInputFile = ({ value, defaultValue }: FileUploadOptions) => {
  const [file, setFile] = useState<File | null>(value ?? defaultValue ?? null)

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(e.dataTransfer.files[0])
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }
    setFile(null)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(e.dataTransfer.files[0])

    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Only use the first file
      const file = files[0]
      setFile(file)
    }
  }, [])

  const openFileDialog = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }, [])

  return {
    file,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
  }
}
