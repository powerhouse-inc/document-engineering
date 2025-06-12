import { cn } from '../../../../scalars/lib/utils.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/form-group.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/form-label.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/message-list.js'
import React, { useCallback, useId } from 'react'
import { Button } from '../../../../scalars/components/fragments/button/index.js'
import { Command } from '../../../../scalars/components/fragments/command/index.js'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../scalars/components/fragments/popover/index.js'
import { Content } from './content.js'
import { SelectDiff } from './select-diff.js'
import { SelectedContent } from './selected-content.js'
import { useSelect } from './use-select.js'
import type { SelectProps } from './types.js'

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      // core functionality props
      options = [],
      favoriteOptions = [],
      defaultValue,
      value,
      onChange,
      onBlur,

      // form-related props
      id: propId,
      name,
      label,
      required,
      disabled,

      // validation props
      errors = [],
      warnings = [],

      // behavior props
      multiple,
      selectionIcon = 'auto',
      selectionIconPosition = 'left',
      searchable,

      // display props
      description,
      placeholder,
      className,
      contentClassName,
      contentAlign = 'start',

      // diff props
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const prefix = useId()
    const id = propId ?? `${prefix}-select`

    const allOptions = [...favoriteOptions, ...options]
    const { selectedValues, isPopoverOpen, commandListRef, toggleOption, handleClear, toggleAll, handleOpenChange } =
      useSelect({
        options: allOptions,
        multiple,
        defaultValue,
        value,
        onChange,
      })

    const onTriggerBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!isPopoverOpen) {
          // trigger the blur event when the trigger loses focus but the popover is not open,
          // because when the popover is open, the trigger loses focus but the select as a component still has the focus
          onBlur?.(e)
        }
      },
      [onBlur, isPopoverOpen]
    )

    const selectedLabels = selectedValues
      .map((val) => allOptions.find((opt) => opt.value === val)?.label ?? val)
      .join(', ')

    const baseLabels =
      baseValue !== undefined && baseValue !== ''
        ? (Array.isArray(baseValue) ? baseValue : [baseValue])
            .map((val) => allOptions.find((opt) => opt.value === val)?.label ?? val)
            .join(', ')
        : baseValue

    if (viewMode === 'edition') {
      return (
        <FormGroup>
          {label && (
            <FormLabel
              htmlFor={id}
              required={required}
              disabled={disabled}
              hasError={errors.length > 0}
              inline={false}
              onClick={(e) => {
                e.preventDefault()
                ;(e.target as HTMLLabelElement).control?.focus()
              }}
            >
              {label}
            </FormLabel>
          )}
          <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => {
              handleOpenChange(open)
              // if the popover is closing and it was not by the trigger button
              if (!open && document.activeElement?.id !== id) {
                onBlur?.({ target: {} } as React.FocusEvent<HTMLButtonElement>)
              }
            }}
          >
            <PopoverTrigger asChild={true}>
              {/* TODO: create a trigger component */}
              <Button
                id={id}
                name={name}
                type="button"
                role="combobox"
                onBlur={onTriggerBlur}
                onKeyDown={(e) => {
                  const shouldPreventOpening = isPopoverOpen || /^[0-9]$/.test(e.key) || !/^[a-zA-Z]$/.test(e.key)
                  // Prevent opening for numbers and non-letter characters (only letters)
                  if (shouldPreventOpening) {
                    return
                  }
                  handleOpenChange(true)
                }}
                disabled={disabled}
                aria-invalid={errors.length > 0}
                aria-label={label ? undefined : multiple ? 'Multi select' : 'Select'}
                aria-required={required}
                aria-expanded={isPopoverOpen}
                className={cn(
                  'flex h-9 w-full items-center justify-between px-3 py-2',
                  'dark:border-charcoal-700 dark:bg-charcoal-900 rounded-md border border-gray-300 bg-white',
                  'hover:border-gray-300 hover:bg-gray-100',
                  'dark:hover:border-charcoal-700 dark:hover:bg-charcoal-800',
                  'dark:focus:ring-charcoal-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-0',
                  'dark:focus-visible:ring-charcoal-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:ring-offset-0',
                  disabled && [
                    '!pointer-events-auto cursor-not-allowed bg-gray-50',
                    'dark:hover:border-charcoal-700 dark:hover:bg-charcoal-900 hover:border-gray-300 hover:bg-gray-50',
                  ],
                  'select',
                  className
                )}
                {...props}
                ref={ref}
              >
                <SelectedContent
                  selectedValues={selectedValues}
                  options={allOptions}
                  multiple={multiple}
                  searchable={searchable}
                  placeholder={placeholder}
                  handleClear={handleClear}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align={contentAlign}
              onEscapeKeyDown={(e) => {
                e.preventDefault()
                handleOpenChange(false)
              }}
              className={contentClassName}
            >
              <Command
                defaultValue={
                  !multiple && selectedValues[0]
                    ? allOptions.find((opt) => opt.value === selectedValues[0])?.label
                    : undefined
                }
              >
                <Content
                  favoriteOptions={favoriteOptions}
                  searchable={searchable}
                  commandListRef={commandListRef}
                  multiple={multiple}
                  selectedValues={selectedValues}
                  selectionIcon={selectionIcon}
                  selectionIconPosition={selectionIconPosition}
                  options={options}
                  toggleAll={toggleAll}
                  toggleOption={toggleOption}
                />
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          {warnings.length > 0 && <FormMessageList messages={warnings} type="warning" />}
          {errors.length > 0 && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }

    return (
      <SelectDiff value={selectedLabels} label={label} required={required} viewMode={viewMode} baseValue={baseLabels} />
    )
  }
)

Select.displayName = 'Select'

export { Select }
