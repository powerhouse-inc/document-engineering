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
  const fileToValidate = normalizeToFile(file)
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
  const fileToValidate = normalizeToFile(file)
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
 * Normalizes an input (File or Data URL) to a File object.
 * @param input - The value to normalize.
 * @returns A File object or null if the conversion fails.
 */
export const normalizeToFile = (input: File | string | null | undefined): File | null => {
  if (!input) return null
  if (input instanceof File) {
    return input
  }
  return dataUrlToFile(input)
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
 * Validates if a string is in valid Base64 format.
 *
 * This function checks if the provided string conforms to the Base64 encoding standard
 * (RFC 4648). It handles both raw Base64 strings and Data URLs (data:type/subtype;base64,data).
 *
 * @param str - The string to validate
 * @returns `true` if the string is valid Base64, `false` otherwise
 *
 * @example
 * ```typescript
 * isBase64('SGVsbG8gV29ybGQ=') // true - valid base64
 * isBase64('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...') // true - data URL
 * isBase64('Hello World') // false - not base64
 * isBase64('SGVsbG8gV29ybGQ===') // false - invalid padding
 * isBase64('') // false - empty string
 * ```
 *
 */
export const isBase64 = (str: string): boolean => {
  if (typeof str !== 'string' || str.length === 0) {
    return false
  }

  // Extract base64 data from Data URL if present
  const base64Data = str.includes(',') ? str.split(',')[1] : str

  // Base64 strings must have length that is a multiple of 4
  if (base64Data.length % 4 !== 0) {
    return false
  }

  // Check for valid base64 characters: A-Z, a-z, 0-9, +, /, and padding =
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/

  // Additional validation: padding can only be 0, 1, or 2 characters
  const paddingCount = (base64Data.match(/=/g) ?? []).length
  if (paddingCount > 2) {
    return false
  }

  return base64Regex.test(base64Data)
}

export const getMimeTypeFromBase64 = (base64: string): string | null => {
  const match = base64.match(/^data:([^;]+);base64,/)
  return match ? match[1] : null
}

export const getBase64Size = (base64: string): number => {
  if (!base64 || typeof base64 !== 'string') return 0

  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  let padding = 0
  if (base64Data.endsWith('==')) {
    padding = 2
  } else if (base64Data.endsWith('=')) {
    padding = 1
  }

  return (base64Data.length * 3) / 4 - padding
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

// /**
//  * Converts a Data URL (base64 string) to a File object.
//  * @param dataUrl - The string in Data URL format.
//  * @returns A File object or null if the conversion fails.
//  */
export const dataUrlToFile = (dataUrl: string): File | null => {
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

    const extension = mimeType.split('/')[1] || 'bin'
    const finalFileName = `file_${Date.now()}.${extension}`

    return new File([byteArray], finalFileName, { type: mimeType, lastModified: Date.now() })
  } catch (_error) {
    return null
  }
}
