import React, { useCallback, useId } from 'react'
import type { FileInputProps } from './types.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { Icon } from '../../icon/icon.js'
import FileBackground from '../../icon-components/FileBackground.js'
import { Input } from '../../../../ui/components/data-entry/input/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/form-label.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { useDropzone } from 'react-dropzone'
import { formatBytes, getExtensionsFromMimeTypes } from './utils.js'
import { Button } from '../../../../scalars/components/fragments/button/button.js'
import { useFileUpload } from './useUploadFile.js'
import { FileUploadItem } from './sub-components/file-upload-item.js'

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      name,
      label,
      description,
      required,
      disabled = false,
      errors = [],
      warnings = [],
      id: propId,
      maxFileSize,
      allowedFileTypes,
      value,
      defaultValue,
      dragAndDropEnabled = true,
      onChange,

      // Item Props
      fileName,
      fileSize,
      mimeType,
      progress,
      onCancel,
      onReload,
      errorsUpload,
      status = 'idle',
      ...props
    },
    ref
  ) => {
    const prefix = useId()
    const id = propId ?? `${prefix}-file`
    const hasError = Array.isArray(errors) && errors.length > 0
    const hasWarning = Array.isArray(warnings) && warnings.length > 0
    const allowedFileTypesString = Array.isArray(allowedFileTypes) ? allowedFileTypes : []

    const { handleDrop, borderIndicator } = useFileUpload({ value, defaultValue, onChange })

    const { getInputProps, getRootProps, open, inputRef } = useDropzone({
      onDropAccepted: (acceptedFiles) => {
        handleDrop(acceptedFiles)
      },
    })

    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref, inputRef]
    )

    return (
      <div className="flex flex-col">
        {!!label && (
          <FormLabel
            htmlFor={id}
            id={`${id}-label`}
            disabled={disabled}
            hasError={hasError}
            required={required}
            className={cn(disabled && 'pointer-events-none')}
          >
            {label}
          </FormLabel>
        )}

        <div className="flex flex-col w-full h-full pt-3.5 min-h-[148px]">
          <div className="relative h-[148px]">
            <div
              className={cn('absolute z-0 h-full w-full', borderIndicator)}
              data-state={value ? 'selected' : 'idle'}
              data-testid="file-input-border"
            >
              <FileBackground className="w-full h-full opacity-50" />
            </div>

            <div
              {...getRootProps({
                role: 'group',
                className: cn(
                  'dropzone',
                  'relative flex w-full flex-col h-full cursor-pointer',
                  !dragAndDropEnabled && 'opacity-50 pointer-events-none cursor-not-allowed',
                  disabled && 'cursor-not-allowed',
                  // padding
                  'px-3 py-4'
                ),
                tabIndex: disabled ? -1 : 0,
              })}
              data-testid="file-drop-area"
            >
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Icon name="FileUpload" size={40} className="text-gray-500" aria-hidden="true" />
                  <p className="text-gray-500 font-normal text-sm leading-5">{description}</p>
                </div>
              )}
              {status !== 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-full">
                    <FileUploadItem
                      errorsUpload={errorsUpload}
                      mimeType={mimeType}
                      fileName={fileName}
                      fileSize={formatBytes(fileSize ?? 0, 2)}
                      progress={progress}
                      status={status}
                      onCancel={onCancel}
                      onReload={onReload}
                    />
                  </div>
                </div>
              )}
              <Input
                {...getInputProps({
                  name,
                  id,
                  required,
                  disabled,
                  type: 'file',
                  multiple: false,
                  ...props,
                })}
                aria-invalid={hasError}
                aria-required={required}
                aria-labelledby={label ? `${id}-label` : undefined}
                ref={mergedRef}
              />
            </div>
            {status === 'idle' && (
              <div
                className={cn(
                  'absolute bottom-4 left-1/2 transform -translate-x-1/2 z-1 pointer-events-auto',
                  disabled && 'pointer-events-none'
                )}
              >
                <Button
                  type="button"
                  onClick={open}
                  disabled={disabled}
                  aria-label="Search File"
                  className={cn(
                    'inline-block h-10 bg-white border border-[#E4E4E7] rounded-md text-gray-500 cursor-pointer text-sm font-medium leading-5',
                    // padding
                    'px-4 py-2',
                    // hover
                    'hover:bg-white hover:text-gray-500 hover:cursor-pointer'
                  )}
                >
                  Search File
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-gray-500 font-normal text-xs leading-4.5 truncate">
            Supports: {getExtensionsFromMimeTypes(allowedFileTypesString).join(', ')}
          </span>
          <span className="text-gray-500 font-medium text-xs leading-4.5 truncate">
            Max: {formatBytes(maxFileSize, 2)}
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {hasError && <FormMessageList messages={errors} type="error" />}
          {hasWarning && <FormMessageList messages={warnings} type="warning" />}
        </div>
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'

export { FileInput }
