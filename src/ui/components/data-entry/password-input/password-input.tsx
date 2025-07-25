import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '../input/index.js'
import { cn, useUniqueId } from '../../../../scalars/lib/index.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { Popover, PopoverAnchor, PopoverContent } from '../../../../scalars/components/fragments/popover/index.js'
import { PasswordStrength } from './password-strength.js'
import { Icon } from '../../icon/index.js'
import { PasswordInputDiff } from './password-input-diff.js'
import type { PasswordInputProps } from './types.js'

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id: idProp,
      className,
      label,
      description,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onClick,
      disabled,
      required,
      errors,
      warnings,
      pattern,
      showPasswordStrength = true,
      showPasswordStrengthOpen = false,
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const prefix = useUniqueId()
    const id = idProp ?? `${prefix}-password-input`

    const [isPopoverOpen, setIsPopoverOpen] = useState(showPasswordStrengthOpen)
    const [password, setPassword] = useState(value ?? defaultValue ?? '')
    const [showPassword, setShowPassword] = useState(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetPopoverTimeout = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsPopoverOpen(false)
      }, 10000)
    }, [])

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPopoverOpen(true)
        setPassword(event.target.value)
        onChange?.(event)
        resetPopoverTimeout()
      },
      [onChange, resetPopoverTimeout]
    )

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && isPopoverOpen) {
          setIsPopoverOpen(false)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        }
        onKeyDown?.(event)
      },
      [isPopoverOpen, onKeyDown]
    )

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLInputElement>) => {
        setIsPopoverOpen(true)
        onClick?.(event)
        resetPopoverTimeout()
      },
      [onClick, resetPopoverTimeout]
    )

    useEffect(() => {
      if (value !== undefined) {
        setPassword(value)
      }
    }, [value])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const hasWarning = Array.isArray(warnings) && warnings.length > 0
    const hasError = Array.isArray(errors) && errors.length > 0

    if (viewMode !== 'edition') {
      return (
        <PasswordInputDiff
          value={password}
          label={label}
          required={required}
          viewMode={viewMode}
          baseValue={baseValue}
        />
      )
    }

    return (
      <FormGroup>
        {!!label && (
          <FormLabel
            htmlFor={id}
            disabled={disabled}
            hasError={hasError}
            required={required}
            onClick={(e) => {
              e.preventDefault()
              ;(e.target as HTMLLabelElement).control?.focus()
            }}
          >
            {label}
          </FormLabel>
        )}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverAnchor asChild={true}>
            <div ref={containerRef} className={cn('relative')}>
              <Input
                ref={ref}
                id={id}
                value={password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className={cn('pr-9', className)}
                disabled={disabled}
                aria-invalid={hasError}
                aria-label={!label ? 'Password input' : undefined}
                aria-required={required}
                type={showPassword ? 'text' : 'password'}
                pattern={pattern?.source}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                {...(!!label && { 'data-label': label })}
                {...props}
              />
              <div className={cn('absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center')}>
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}
                  className={cn('group focus-visible:outline-none')}
                >
                  <Icon
                    name={showPassword ? 'Hide' : 'Show'}
                    size={16}
                    className={cn(
                      'text-gray-500 group-hover:text-gray-700 group-focus:text-gray-700 pointer-events-none'
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            onOpenAutoFocus={(e) => {
              e.preventDefault()
            }}
            onInteractOutside={(e) => {
              if (e.target instanceof Element && containerRef.current) {
                const isWithinContainer = containerRef.current.contains(e.target as Node)
                if (isWithinContainer) {
                  e.preventDefault()
                }
              }
            }}
            className={cn('border-none shadow-[0px_2px_12px_0px_rgba(37,42,52,0.10)]')}
          >
            {showPasswordStrength && <PasswordStrength password={password} />}
          </PopoverContent>
        </Popover>
        {!!description && <FormDescription>{description}</FormDescription>}
        {hasWarning && <FormMessageList messages={warnings} type="warning" />}
        {hasError && <FormMessageList messages={errors} type="error" />}
      </FormGroup>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
