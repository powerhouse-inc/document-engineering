import React, { useCallback, useId } from 'react'
import type { FileInputProps } from './types.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { Icon } from '../../icon/icon.js'
import FileBackground from '../../icon-components/FileBackground.js'
import { Input } from '../../../../ui/components/data-entry/input/index.js'
import { FormLabel, FormMessageList } from '../../../../scalars/components/index.js'
import { formatBytes } from './utils.js'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../button/button.js'

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      name,
      label,
      description,
      required,
      disabled = false,
      errors = [],
      id: propId,
      maxFileSize,
      allowedFileTypes,
      dragAndDropEnabled = true,
      ...props
    },
    ref
  ) => {
    const prefix = useId()
    const id = propId ?? `${prefix}-file`
    const hasError = Array.isArray(errors) && errors.length > 0
    const allowedFileTypesString = Array.isArray(allowedFileTypes) ? allowedFileTypes.join(', ') : ''

    const { getInputProps, getRootProps, open, inputRef } = useDropzone()

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
            <div className="absolute z-0 h-full w-full">
              <FileBackground className="w-full opacity-50" />
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
              <div className="flex flex-col items-center justify-center gap-2">
                <Icon name="FileUpload" size={40} className="text-gray-500" aria-hidden="true" />
                <p className="text-gray-500 font-normal text-sm leading-5">{description}</p>
              </div>
              <Input
                {...getInputProps({
                  name,
                  id,
                  required,
                  disabled,
                  type: 'file',
                  accept: props.accept,
                  multiple: false,
                })}
                aria-invalid={hasError}
                aria-required={required}
                aria-labelledby={label ? `${id}-label` : undefined}
                ref={mergedRef}
              />
            </div>
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
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-gray-500 font-normal text-xs leading-4.5 truncate">
              Supports: {allowedFileTypesString}
            </span>
            <span className="text-gray-500 font-medium text-xs leading-4.5 truncate">
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
