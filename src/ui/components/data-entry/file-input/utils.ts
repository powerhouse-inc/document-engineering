import mime from 'mime/lite'
import type { IconName } from '../../icon-components/index.js'
import type { PreviewType } from './types.js'
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
export const detectPreviewType = (file?: File): 'pdf' | 'image' | 'audio' | 'video' | undefined => {
  if (!file) return undefined
  const mimeType = file.type
  if (Object.keys(MIME_TYPE_TO_EXTENSION_IMAGE).includes(mimeType)) return 'image'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_AUDIO).includes(mimeType)) return 'audio'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_PDF).includes(mimeType)) return 'pdf'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_VIDEO).includes(mimeType)) return 'video'
}

export const isCorruptedFile = async (file: File): Promise<boolean> => {
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

export const validateFileForPreview = async (file?: File) => {
  if (!file) return

  const typePreview = detectPreviewType(file)
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
