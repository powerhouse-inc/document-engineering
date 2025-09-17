import mime from 'mime/lite'
import type { IconName } from '../../icon-components/index.js'
import type { PreviewStatus, PreviewType } from './types.js'
export const MESSAGES = {
  success: 'Upload successful',
  error: 'Upload failed',
  preview: 'Preview',
}

export const formatBytes = (bytes?: number, decimals = 2, binaryUnits = false): string => {
  if (!bytes) return '0 Bytes'
  if (bytes === 0) return '0 Bytes'
  if (isNaN(bytes) || bytes < 0) return 'Invalid size'

  const base = binaryUnits ? 1024 : 1000
  const units = binaryUnits ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] : ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB']

  const dm = Math.max(0, decimals)

  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1)

  const num = bytes / base ** i
  const formatted = Number(num.toFixed(dm))

  return `${formatted} ${units[i]}`
}

export function getExtensionsFromMimeTypes(mimeTypes?: string[]): string[] {
  if (!mimeTypes) return []
  return mimeTypes.map((type) => mime.getExtension(type)).filter((ext): ext is string => Boolean(ext))
}

const ICON_CODE_TO_NAME: Record<string, IconName> = {
  DOC: 'ExportCsv',
  ZIP: 'ExportZip',
  PDF: 'ExportPdf',
  JSON: 'ExportJson',
  UBL: 'ExportUbl',
  CSV: 'ExportCsv',
  PNG: 'PlaceholderImage',
  JPG: 'PlaceholderImage',
  JPEG: 'PlaceholderImage',
  WEBP: 'PlaceholderImage',
}

export const getIconKey = (mimeType: string): IconName => {
  if (!mimeType || typeof mimeType !== 'string') {
    return 'DownloadFile'
  }
  let iconName: IconName = 'DownloadFile'

  const extension = mime.getExtension(mimeType)
  const existsExtension = Object.keys(ICON_CODE_TO_NAME).includes(extension?.toUpperCase() ?? '')
  if (existsExtension) {
    iconName = ICON_CODE_TO_NAME[extension?.toUpperCase() ?? '']
  }

  return iconName
}

const MIME_TYPE_TO_EXTENSION_IMAGE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

const MIME_TYPE_TO_EXTENSION_AUDIO = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/aac': 'aac',
  'audio/m4a': 'm4a',
}

const MIME_TYPE_TO_EXTENSION_PDF = {
  'application/pdf': 'pdf',
}

const MIME_TYPE_TO_EXTENSION_VIDEO = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogg',
}

export const validatePdfHeader = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const text = new TextDecoder().decode(buffer)

  const hasHeader = text.startsWith('%PDF-')
  const hasEOF = text.includes('%%EOF')
  const hasXref = text.includes('xref')
  const hasTrailer = text.includes('trailer')

  return hasHeader && hasEOF && hasXref && hasTrailer
}

export const validateImageHeader = async (file: File) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(true)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }

    img.src = url
  })
}

export const validateAudio = async (file: File): Promise<boolean> => {
  try {
    const audioContext = new AudioContext()
    const arrayBuffer = await file.arrayBuffer()
    await audioContext.decodeAudioData(arrayBuffer)
    return true
  } catch {
    return false
  }
}

export const validateVideo = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.src = url
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(true)
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }
  })
}

const fileValidators = {
  pdf: validatePdfHeader,
  image: validateImageHeader,
  audio: validateAudio,
  video: validateVideo,
}
export const detectPreviewType = (file?: File | string): 'pdf' | 'image' | 'audio' | 'video' | undefined => {
  if (!file) return undefined
  const fileToValidate = file instanceof File ? file : dataUrlToFile(file)
  if (!fileToValidate) return undefined
  const mimeType = fileToValidate.type
  if (Object.keys(MIME_TYPE_TO_EXTENSION_IMAGE).includes(mimeType)) return 'image'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_AUDIO).includes(mimeType)) return 'audio'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_PDF).includes(mimeType)) return 'pdf'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_VIDEO).includes(mimeType)) return 'video'
}

export const isCorruptedFile = async (file: File | string): Promise<boolean> => {
  if (!file) return false
  if (typeof file === 'string') {
    if (!isBase64(file)) return false
    const fileToValidate = dataUrlToFile(file)
    if (!fileToValidate) return false
    const fileType = detectPreviewType(fileToValidate)
    if (!fileType) return false
    const validator = fileValidators[fileType]
    const isValid = await validator(fileToValidate)
    return !isValid
  }

  const fileType = detectPreviewType(file)
  if (!fileType) return false
  const validator = fileValidators[fileType]
  const isValid = await validator(file)
  return !isValid
}

export const getPreviewComponentFromError = (error: unknown): 'corrupted_file' | 'unsupported_file' | null => {
  if (error instanceof Error) {
    switch (error.message) {
      case 'corrupted_file':
        return 'corrupted_file'
      case 'unsupported_file':
        return 'unsupported_file'
      default:
        return 'unsupported_file'
    }
  }
  return null
}

export const previewSizeStyles = {
  pdf: { width: '500px', height: '652px' },
  video: { width: '600px', height: '340px' },
  image: { width: '368px', height: '384px' },
  audio: { width: '368px', height: '384px' },
  unsupported_file: { width: '500px', height: '652px' },
}

export const validateFileForPreview = async (file?: File | string) => {
  if (!file) return
  const fileToValidate = file instanceof File ? file : dataUrlToFile(file)
  const typePreview = detectPreviewType(fileToValidate ?? undefined)
  if (!typePreview) {
    throw new Error('unsupported_file')
  }

  const isCorrupted = await isCorruptedFile(file)
  if (isCorrupted) {
    throw new Error('corrupted_file')
  }

  await new Promise((res) => setTimeout(res, 2000))

  return 'success'
}

export const getIconLoading = (type: PreviewType): IconName => {
  switch (type) {
    case 'pdf':
      return 'BookOpenText'
    case 'image':
      return 'PlaceholderImage'
    case 'audio':
      return 'PlaceholderAudio'
    case 'video':
      return 'PlaceholderVideo'
    default:
      return 'BookOpenText'
  }
}

export const getBrokenFileIcon = (type: PreviewType): IconName => {
  switch (type) {
    case 'pdf':
      return 'ContentUnavailableIcon'
    case 'image':
      return 'BrokenImage'
    case 'audio':
      return 'BrokenAudio'
    case 'video':
      return 'BrokenVideo'
    default:
      return 'ContentUnavailableIcon'
  }
}

export const getContainerDimensions = (status: PreviewStatus, typePreview?: PreviewType): string => {
  if (status !== 'success') {
    return 'w-[600px] h-[652px]'
  }

  switch (typePreview) {
    case 'pdf':
      return 'w-[500px] h-[652px]'
    case 'video':
      return 'w-[600px] h-[340px]'
    case 'image':
      return 'w-[368px] h-[384px]'
    case 'audio':
      return 'w-[368px] h-[384px]'
    case undefined:
      return 'w-[500px] h-[652px]'
    default:
      return 'w-[500px] h-[652px]'
  }
}

/**
 * Converts a File object to a Base64 string.
 * @param file - The file to convert.
 * @returns A promise that resolves with the Base64 string.
 */
export const fileToBase64 = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (_error) => {
      reject(new Error('Failed to read file'))
    }
  })
}

export const isFile = (value: File | string): value is File => {
  return value instanceof File
}

/**
 * Checks if a string is valid base64.
 * @param str - The string to check.
 * @returns True if it's valid base64.
 */
export const isBase64 = (str: string): boolean => {
  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}

/**
 * Gets the MIME type from a base64 string.
 * @param base64 - The base64 string.
 * @returns The MIME type or null if it cannot be extracted.
 */
export const getMimeTypeFromBase64 = (base64: string): string | null => {
  const match = base64.match(/^data:([^;]+);base64,/)
  return match ? match[1] : null
}

export const getBase64Size = (base64: string): number => {
  // Remove the data:mime/type;base64 prefix if it exists
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  // Calculate the approximate size (base64 is ~33% larger than the original binary)
  return Math.floor((base64Data.length * 3) / 4)
}

export const getMimeType = (value: File | string): string | null => {
  if (isFile(value)) {
    return value.type
  }
  return getMimeTypeFromBase64(value)
}

/**
 * Gets the size of a value (File or base64).
 * @param value - The value to analyze.
 * @returns The size in bytes.
 */
export const getFileSize = (value: File | string): number => {
  if (isFile(value)) {
    return value.size
  }
  return getBase64Size(value)
}

/**
 * Converts a Data URL (base64 string) to a File object.
 * @param dataUrl - The string in Data URL format.
 * @param fileName - Optional. The filename to generate. If not provided, one is generated.
 * @returns A File object or null if the conversion fails.
 */
export const dataUrlToFile = (dataUrl: string, fileName?: string): File | null => {
  const mimeType = getMimeTypeFromBase64(dataUrl)

  if (!mimeType) {
    return null
  }

  const base64Data = dataUrl.split(',')[1]
  if (!base64Data) {
    return null
  }

  if (!isBase64(base64Data)) {
    return null
  }

  try {
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // Generate a filename if one is not provided.
    let finalFileName = fileName
    if (!finalFileName) {
      // Extract the extension from the MIME type (e.g. 'image/png' -> 'png')
      const extension = mimeType.split('/')[1] || 'bin'
      finalFileName = `file_${Date.now()}.${extension}`
    }

    // Create a File
    return new File([byteArray], finalFileName, { type: mimeType, lastModified: Date.now() })
  } catch (error) {
    console.error('Error decoding base64 string:', error)
    return null
  }
}
