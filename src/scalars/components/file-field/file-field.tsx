import { FileInput } from '../../../ui/components/data-entry/file-input/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { FileFieldProps } from './types.js'

const FileField = withFieldValidation<FileFieldProps>(FileInput, {
  validations: {
    _allowedFileTypes:
      ({ allowedFileTypes = [] }) =>
      (value?: File) => {
        if (!allowedFileTypes.length) return true
        if (!value) return true
        const fileType = value.type.toLowerCase()
        const fileTypes = allowedFileTypes.map((type) => type.toLowerCase())
        if (!fileTypes.includes(fileType)) {
          return 'File format is not supported'
        }
        return true
      },
    _maxFileSize:
      ({ maxFileSize = 0 }) =>
      (value?: File) => {
        if (!maxFileSize) return true
        if (!value) return true
        if (value.size > maxFileSize) {
          return 'File size exceed the maximum size supported'
        }
        return true
      },
  },
})

FileField.displayName = 'FileField'

export { FileField }
