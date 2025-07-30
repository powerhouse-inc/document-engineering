import React from 'react'
import { Select } from '../select/index.js'
import { Input } from '../input/index.js'
import { usePhoneNumberInput } from './use-phone-number-input.js'
import { cn, useUniqueId } from '../../../../scalars/lib/index.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import type { PhoneNumberInputProps } from './types.js'

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    {
      id: idProp,
      className,
      label,
      description,
      value,
      defaultValue,
      onChange,
      disabled,
      required,
      errors,
      warnings,
      allowedCountries,
      excludedCountries,
      includeDependentAreas,
      optionFormat = 'FlagsAndNumbers',
      selectProps,
      viewMode = 'edition',
      // TODO: implement diffs
      // baseValue,
      ...props
    },
    ref
  ) => {
    const prefix = useUniqueId()
    const id = idProp ?? `${prefix}-phone-number-input`

    const { options, selectValue, inputValue, handleSelectOnChange, handleInputOnChange } = usePhoneNumberInput({
      value,
      defaultValue,
      onChange,
      allowedCountries,
      excludedCountries,
      includeDependentAreas,
      optionFormat,
    })

    const hasWarning = Array.isArray(warnings) && warnings.length > 0
    const hasError = Array.isArray(errors) && errors.length > 0

    if (viewMode !== 'edition') {
      // TODO: implement PhoneNumberInputDiff
      return null
    }

    return (
      <FormGroup>
        {!!label && (
          <FormLabel htmlFor={id} disabled={disabled} hasError={hasError} required={required}>
            {label}
          </FormLabel>
        )}
        <div
          className={cn(
            'relative flex items-center h-9 bg-white rounded-md border border-gray-300',
            'focus-within:ring-1 focus-within:ring-offset-0 focus-within:ring-gray-900'
          )}
        >
          <Select
            options={options}
            selectionIcon="checkmark"
            selectionIconPosition="right"
            searchable={selectProps?.searchable ?? true}
            disabled={disabled}
            value={selectValue}
            onChange={(newValue) => {
              handleSelectOnChange(newValue as string)
            }}
            placeholder={selectProps?.placeholder}
            className={cn(
              'focus:ring-0 focus:ring-offset-0',
              'outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
              'h-full border-none rounded-l-md rounded-r-none',
              'bg-transparent focus:bg-transparent hover:bg-transparent',
              selectProps?.className
            )}
            contentClassName={cn('w-30', selectProps?.contentClassName)}
          />
          <div className="flex items-center h-full border-l border-gray-300" />
          <Input
            ref={ref}
            id={id}
            value={inputValue}
            onChange={handleInputOnChange}
            disabled={disabled}
            aria-invalid={hasError}
            aria-label={!label ? 'Phone number input' : undefined}
            aria-required={required}
            type="tel"
            className={cn(
              'focus:ring-0 focus:ring-offset-0',
              'outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
              'h-full border-none rounded-r-md rounded-l-none',
              'bg-transparent',
              className
            )}
            {...props}
          />
        </div>
        {!!description && <FormDescription>{description}</FormDescription>}
        {hasWarning && <FormMessageList messages={warnings} type="warning" />}
        {hasError && <FormMessageList messages={errors} type="error" />}
      </FormGroup>
    )
  }
)

PhoneNumberInput.displayName = 'PhoneNumberInput'

export { PhoneNumberInput }
