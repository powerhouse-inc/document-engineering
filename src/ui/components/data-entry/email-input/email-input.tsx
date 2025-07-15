import React, { useMemo } from 'react'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { Input } from '../input/index.js'
import type { EmailInputProps } from './types.js'
import { useUniqueId } from '../../../../scalars/lib/utils.js'
import useControllableState from '../../../hooks/use-controllable-state.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      name,
      label,
      description,
      required,
      disabled = false,
      warnings,
      errors,
      value,
      defaultValue,
      autoComplete,
      id: propId,
      onChange,
      onBlur,
      baseValue,
      viewMode = 'edition',
      ...props
    },
    ref
  ) => {
    const [emailValue, handleChange] = useControllableState<string>({
      value,
      defaultValue,
      onChange,
    })

    const prefix = useUniqueId()
    const id = propId ?? `${prefix}-email`
    const autoCompleteValue = autoComplete === true ? 'email' : autoComplete === false ? 'off' : undefined

    // Filter maxLength from props since it's avoid default browser behavior
    const filteredProps = useMemo(
      () => Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'maxLength')),
      [props]
    )
    if (viewMode === 'edition') {
      return (
        <FormGroup>
          <FormLabel htmlFor={id} required={required} disabled={disabled} hasError={!!errors?.length}>
            {label}
          </FormLabel>
          <Input
            name={name}
            value={emailValue ?? ''}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            id={id}
            type="email"
            autoComplete={autoCompleteValue}
            required={required}
            ref={ref}
            {...(label && { 'data-label': label })}
            {...filteredProps}
          />
          {description && <FormDescription>{description}</FormDescription>}
          {warnings && <FormMessageList messages={warnings} type="warning" />}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }
    return (
      <SplittedInputDiff
        baseValue={baseValue}
        value={emailValue ?? ''}
        viewMode={viewMode}
        diffMode="sentences"
        data-testid="email-input-diff"
      />
    )
  }
)

EmailInput.displayName = 'EmailInput'

export { EmailInput }
