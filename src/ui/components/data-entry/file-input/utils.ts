import mime from 'mime/lite'
import type { IconName } from '../../icon-components/index.js'
import { PREVIEW_STATUS, type PreviewStatus, type StatusConfig } from './types.js'
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
  if (extension) {
    iconName = ICON_CODE_TO_NAME[extension.toUpperCase()]
  }

  return iconName
}

export const STATUS_CONFIG_PDF: Record<PreviewStatus, StatusConfig> = {
  [PREVIEW_STATUS.LOADING]: {
    icon: 'BookOpenText',
    title: 'Loading',
    message: '',
  },
  [PREVIEW_STATUS.UNSUPPORTED_FORMAT]: {
    icon: 'ContentUnavailableIcon',
    title: 'Opss!',
    message:
      "It looks like we still don't support this format. (We are working on it) Please try to upload it with a different Format.",
  },
  [PREVIEW_STATUS.CORRUPTED_FILE]: {
    icon: 'ContentUnavailableIcon',
    title: '',
    message: 'Your file is corrupted and cannot be shown in the preview',
  },
  [PREVIEW_STATUS.SUCCESS]: {
    icon: undefined,
    title: '',
    message: '',
  },
}
export const STATUS_CONFIG_IMAGE: Record<PreviewStatus, StatusConfig> = {
  [PREVIEW_STATUS.LOADING]: {
    icon: 'Image',
    title: 'Loading',
    message: '',
  },
  [PREVIEW_STATUS.UNSUPPORTED_FORMAT]: {
    icon: 'BrokenImage',
    title: 'Opss!',
    message:
      "It looks like we still don't support this format. (We are working on it) Please try to upload it with a different Format.",
  },
  [PREVIEW_STATUS.CORRUPTED_FILE]: {
    icon: 'BrokenImage',
    title: '',
    message: 'Your file is corrupted and cannot be shown in the preview',
  },
  [PREVIEW_STATUS.SUCCESS]: {
    icon: undefined,
    title: '',
    message: '',
  },
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

export const detectPreviewType = (mimeType?: string): 'pdf' | 'image' | 'audio' | 'unknown' => {
  if (!mimeType) return 'unknown'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_IMAGE).includes(mimeType)) return 'image'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_AUDIO).includes(mimeType)) return 'audio'
  if (Object.keys(MIME_TYPE_TO_EXTENSION_PDF).includes(mimeType)) return 'pdf'
  return 'unknown'
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
