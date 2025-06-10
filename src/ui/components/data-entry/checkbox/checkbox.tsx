import { cn } from '../../../../scalars/lib/utils.js'
import React, { useId } from 'react'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import { CheckboxBase, type CheckboxValue } from './checkbox-base.js'
import { CheckboxDiff } from './subcomponents/checkboxdiff.js'

type CheckboxBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<CheckboxValue> | 'onChange'
> &
  Omit<WithDifference<boolean>, 'diffMode'>

export interface CheckboxProps extends CheckboxBaseProps, InputBaseProps<CheckboxValue> {
  onChange?: ((checked: CheckboxValue) => void) | ((checked: boolean) => void)
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      id: idProp,
      name,
      label,
      value,
      defaultValue,
      disabled,
      required,
      description,
      errors,
      warnings,
      onChange,
      className,
      // Diff props
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const hasError = !!errors?.length

    const castValue = (value: unknown) => {
      if (value === 'true') return true
      if (value === 'false') return false
      return value
    }

    if (viewMode === 'edition') {
      return (
        <div className={cn('flex flex-col gap-2')}>
          <div className={cn('group flex items-center space-x-2', className)}>
            <CheckboxBase
              id={id}
              name={name}
              checked={castValue(value ?? defaultValue) as CheckboxValue}
              disabled={disabled}
              onCheckedChange={onChange}
              required={required}
              invalid={hasError}
              aria-invalid={hasError}
              ref={ref}
              {...props}
            />
            <FormLabel
              htmlFor={id}
              required={required}
              disabled={disabled}
              hasError={hasError}
              description={description}
              className={cn(!disabled && 'group-hover:cursor-pointer')}
              inline
            >
              {label}
            </FormLabel>
          </div>
          {warnings && <FormMessageList type="warning" messages={warnings} />}
          {errors && <FormMessageList type="error" messages={errors} />}
        </div>
      )
    }
    return (
      <CheckboxDiff
        value={value as boolean}
        label={label}
        required={required}
        disabled={disabled}
        baseValue={baseValue}
        viewMode={viewMode}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
