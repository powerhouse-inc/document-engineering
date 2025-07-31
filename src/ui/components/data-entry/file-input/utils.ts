import mime from 'mime/lite'
export const MESSAGES = {
  success: 'Upload successful',
  error: 'Upload failed',
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

type Accept = Record<string, string[]>

export const convertirMimesAObjetoAccept = (allowedFileTypes?: string[]): Accept => {
  if (!allowedFileTypes) return {}
  if (!Array.isArray(allowedFileTypes) || allowedFileTypes.length === 0) {
    return {}
  }
  const acceptObject: Accept = {}

  allowedFileTypes.forEach((mimeType) => {
    const extension = mime.getExtension(mimeType)
    if (extension) {
      acceptObject[mimeType] = [`.${extension}`]
    }
  })

  return acceptObject
}
