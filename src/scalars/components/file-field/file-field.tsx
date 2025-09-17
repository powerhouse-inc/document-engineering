import { FileInput } from '../../../ui/components/data-entry/file-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import { getFileSize, getMimeType } from '../../../ui/components/data-entry/file-input/utils.js'
import type { FileFieldProps } from './types.js'

const FileField = withFieldValidation<FileFieldProps>(FileInput, {
  validations: {
    _allowedFileTypes:
      ({ allowedFileTypes = [] }) =>
      (value?: File | string) => {
        if (!allowedFileTypes.length) return true
        if (!value) return true
        const fileType = getMimeType(value)?.toLowerCase()
        if (!fileType) return 'File format is not supported'
        const fileTypes = allowedFileTypes.map((type) => type.toLowerCase())
        if (!fileTypes.includes(fileType)) {
          return 'File format is not supported'
        }
        return true
      },
    _maxFileSize:
      ({ maxFileSize = 0 }) =>
      (value?: File | string) => {
        if (!maxFileSize) return true
        if (!value) return true
        const fileSize = getFileSize(value)
        if (fileSize > maxFileSize) {
          return 'File size exceed the maximum size supported'
        }
        return true
      },
  },
})

FileField.displayName = 'FileField'

export { FileField }
