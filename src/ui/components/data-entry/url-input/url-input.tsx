import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import UrlFavicon from './url-favicon.js'
import { useURLWarnings } from './useURLWarnings.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { sharedValueTransformers } from '../../../../scalars/lib/shared-value-transformers.js'
import ValueTransformer from '../../../../scalars/components/fragments/value-transformer/index.js'
import { Input } from '../input/index.js'
import { UrlInputDiff } from './url-input-diff.js'
import { cn } from '../../../../scalars/lib/utils.js'
import type { UrlInputProps } from './types.js'

const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
  (
    {
      label,
      description,
      required,
      disabled,
      showWarnings = true,
      warnings: warningsProp,
      errors,
      platformIcons,
      value,
      defaultValue,
      className,
      onBlur,
      onChange,
      onKeyDown,
      // diff props
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const idGenerated = useId()
    const id = props.id ?? idGenerated
    const hasError = !!errors?.length

    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '')
    const { warnings, checkForWarnings } = useURLWarnings(internalValue)

    const showIcon = Object.keys(platformIcons ?? {}).length > 0

    const combinedWarnings = useMemo(() => {
      return [...(warningsProp ?? []), ...warnings]
    }, [warningsProp, warnings])

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        checkForWarnings()
        onBlur?.(event)
      },
      [checkForWarnings, onBlur]
    )

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(event.target.value)
        onChange?.(event)
      },
      [onChange]
    )

    const handleWarningsOnEnter = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          checkForWarnings()
        }
        onKeyDown?.(event)
      },
      [checkForWarnings, onKeyDown]
    )

    // prevent url from having trailing spaces
    const transformers = useMemo(() => [sharedValueTransformers.trimOnBlur()], [])

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    if (viewMode === 'edition') {
      return (
        <FormGroup>
          <FormLabel htmlFor={id} required={required} disabled={disabled} hasError={!!errors?.length}>
            {label}
          </FormLabel>
          <div className="relative">
            <ValueTransformer transformers={transformers}>
              <Input
                disabled={disabled}
                id={id}
                ref={ref}
                type="url"
                required={required}
                value={internalValue}
                onChange={handleChange}
                aria-invalid={hasError}
                className={cn(showIcon && 'pl-8', className)}
                data-cast="URLTrim"
                onBlur={handleBlur}
                onKeyDown={handleWarningsOnEnter}
                {...props}
              />
            </ValueTransformer>
            <UrlFavicon url={internalValue} platformIcons={platformIcons} className="absolute left-2.5 top-0" />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {showWarnings && combinedWarnings.length > 0 && (
            <FormMessageList messages={combinedWarnings} type="warning" />
          )}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }

    return (
      <UrlInputDiff
        value={internalValue}
        label={label}
        required={required}
        viewMode={viewMode}
        baseValue={baseValue}
        platformIcons={platformIcons}
      />
    )
  }
)

UrlInput.displayName = 'UrlInput'

export { UrlInput }
