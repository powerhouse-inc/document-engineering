import { cn } from '../../../../scalars/lib/utils.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/form-label.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/message-list.js'
import type { InputBaseProps } from '../../../../scalars/components/types.js'
import React, { useId } from 'react'
import { CustomizableRadioGroup } from './customizable-radio-group.js'
import { Radio } from './radio.js'

interface RadioGroupBaseProps {
  options?: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  onChange?: (value: string) => void
}

type RadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof InputBaseProps<string> | keyof RadioGroupBaseProps | 'dir'
> &
  InputBaseProps<string> &
  RadioGroupBaseProps & {
    dir?: 'ltr' | 'rtl'
    className?: string
  }

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      autoFocus,
      className,
      defaultValue,
      description,
      disabled,
      warnings = [],
      errors = [],
      id: propId,
      label,
      name,
      onChange,
      options = [],
      required,
      value,
      ...props
    },
    ref
  ) => {
    const hasLabel = label !== undefined
    const hasError = errors.length > 0
    const prefix = useId()
    const id = propId ?? `${prefix}-radio-group`

    return (
      <CustomizableRadioGroup
        aria-invalid={hasError}
        aria-label={!hasLabel ? 'Radio group' : undefined}
        aria-required={required}
        autoFocus={autoFocus}
        className={cn('flex flex-col gap-2', 'radio-group', className)}
        defaultValue={defaultValue}
        id={id}
        name={name}
        onValueChange={(newValue) => {
          onChange?.(newValue)
        }}
        value={value}
        disabled={disabled}
        {...props}
        ref={ref}
      >
        {hasLabel && (
          <FormLabel description={description} hasError={hasError} htmlFor={id} required={required} disabled={disabled}>
            {label}
          </FormLabel>
        )}
        {options.map((option, index) => (
          <div
            key={`${prefix}-radio-${index}-${option.value}`}
            className={cn('flex items-center gap-2', 'radio-group__item')}
            role="presentation"
          >
            <Radio
              id={`${prefix}-radio-${index}-${option.value}`}
              label={option.label}
              value={option.value}
              description={option.description}
              disabled={disabled || option.disabled}
              hasError={hasError}
            />
          </div>
        ))}
        {warnings.length > 0 && <FormMessageList messages={warnings} type="warning" />}
        {hasError && <FormMessageList messages={errors} type="error" />}
      </CustomizableRadioGroup>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup, type RadioGroupBaseProps, type RadioGroupProps }
