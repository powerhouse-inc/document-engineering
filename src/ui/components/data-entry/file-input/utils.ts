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

export const STATUS_CONFIG: Record<PreviewStatus, StatusConfig> = {
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
  [PREVIEW_STATUS.GENERIC_ERROR]: {
    icon: 'ContentUnavailableIcon',
    title: 'Opss!',
    message: 'It looks like your file has an error.\nPlease try again',
  },
  [PREVIEW_STATUS.CORRUPTED_FILE]: {
    icon: 'ContentUnavailableIcon',
    title: '',
    message: 'Your file is corrupted and cannot be shown in the preview',
  },
}
