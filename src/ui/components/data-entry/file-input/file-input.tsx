import React from 'react'
import type { FileInputProps } from './types.js'
import { cn, useUniqueId } from '../../../../scalars/lib/utils.js'
import { useInputFile } from './use-input-file.js'
import { Icon } from '../../icon/icon.js'
import FileBackground from '../../icon-components/FileBackground.js'
import { FormLabel, FormMessageList } from '../../../../scalars/components/index.js'
import { Input } from '../input/index.js'
import { formatBytes } from './utils.js'

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      name,
      label,
      description,
      required,
      disabled = false,
      errors = [],
      value,
      defaultValue,
      id: propId,
      maxFileSize,
      allowedFileTypes,
      dragAndDropEnabled = true,
      ...props
    },
    ref
  ) => {
    const prefix = useUniqueId()
    const id = propId ?? `${prefix}-file`
    const hasError = Array.isArray(errors) && errors.length > 0
    const allowedFileTypesString = Array.isArray(allowedFileTypes) ? allowedFileTypes.join(', ') : ''

    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useInputFile({
      value,
      defaultValue,
    })

    return (
      <div className="flex flex-col">
        {!!label && (
          <FormLabel
            htmlFor={id}
            disabled={disabled}
            hasError={hasError}
            required={required}
            className={cn(disabled && 'pointer-events-none')}
          >
            {label}
          </FormLabel>
        )}

        <div className="flex flex-col w-full h-full pt-[14px] min-h-[148px] min-w-[247px]">
          <div className="relative h-[148px]">
            <div className="absolute z-0 h-full w-full">
              <FileBackground className="w-full opacity-50" />
            </div>

            <div
              className={cn(
                'relative flex w-full flex-col h-full',
                !dragAndDropEnabled && 'opacity-50',
                disabled && 'cursor-not-allowed'
              )}
            >
              <label
                htmlFor={id}
                onDragEnter={dragAndDropEnabled && !disabled ? handleDragEnter : undefined}
                onDragLeave={dragAndDropEnabled && !disabled ? handleDragLeave : undefined}
                onDragOver={dragAndDropEnabled && !disabled ? handleDragOver : undefined}
                onDrop={dragAndDropEnabled && !disabled ? handleDrop : undefined}
                aria-label="Drop your file here or click to choose files"
                data-testid="file-drop-area"
                className={cn(
                  'flex w-full h-full flex-col px-3 py-4',
                  dragAndDropEnabled && !disabled ? 'cursor-pointer' : 'cursor-not-allowed',
                  !dragAndDropEnabled && 'pointer-events-none'
                )}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Icon name="FileUpload" size={40} className="text-gray-500" />
                  <p className="text-gray-500 font-normal text-[14px] leading-[20px]">{description}</p>
                </div>
              </label>

              <Input
                name={name}
                id={id}
                required={required}
                disabled={disabled}
                aria-required={required}
                aria-invalid={hasError}
                type="file"
                ref={ref}
                aria-describedby={`${id}-hint ${id}-support`}
                aria-label={description ?? 'Drop your file here or click to choose files'}
                className="sr-only"
                {...props}
              />
            </div>
            <div
              className={cn(
                'absolute bottom-4 left-1/2 transform -translate-x-1/2 z-1 pointer-events-auto',
                disabled && 'pointer-events-none'
              )}
            >
              <label
                role="button"
                htmlFor={id}
                className={cn(
                  'inline-block h-10 bg-[#FFF] border border-[#E4E4E7] rounded-md text-gray-500 cursor-pointer text-sm font-medium leading-[20px]',
                  // padding
                  'px-4 py-2',
                  // disabled && 'pointer-events-none',
                  // hover
                  'hover:bg-[#FFF] hover:text-gray-500'
                )}
              >
                Search File
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-gray-500 font-normal text-[12px] leading-[18px] truncate">
              Supports: {allowedFileTypesString}
            </span>
            <span className="text-gray-500 font-medium text-[12px] leading-[18px] truncate">
              Max: {formatBytes(maxFileSize, 2)}
            </span>
          </div>
          {hasError && <FormMessageList messages={errors} type="error" />}
        </div>
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'

export { FileInput }
