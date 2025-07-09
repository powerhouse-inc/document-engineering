/* TODO: Remove this eslint-disable rule and pass requireUppercase, requireLowercase, requireNumbers, requireSpecialCharacters to PasswordStrengthMeter */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '../input/index.js'
import { cn, useUniqueId } from '../../../../scalars/lib/index.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { Popover, PopoverAnchor, PopoverContent } from '../../../../scalars/components/fragments/popover/index.js'
import { ProgressBar } from '../../../../scalars/components/fragments/progress-bar/index.js'
import { Icon } from '../../icon/index.js'
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
      disabled,
      required,
      errors,
      warnings,
      minLength,
      maxLength,
      pattern,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialCharacters = true,
      // TODO: Implement disallowCommonPasswords
      // disallowCommonPasswords = true,
      showPasswordStrength = true,
      viewMode = 'edition',
      // TODO: Implement diffs
      // baseValue,
      ...props
    },
    ref
  ) => {
    const prefix = useUniqueId()
    const id = idProp ?? `${prefix}-password-input`

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [password, setPassword] = useState(value ?? defaultValue ?? '')
    const [showPassword, setShowPassword] = useState(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const mergedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPopoverOpen(true)
        setPassword(event.target.value)
        onChange?.(event)
      },
      [onChange]
    )

    useEffect(() => {
      if (value !== undefined) {
        setPassword(value)
      }
    }, [value])

    const hasWarning = Array.isArray(warnings) && warnings.length > 0
    const hasError = Array.isArray(errors) && errors.length > 0

    // TODO: Implement PasswordInputDiff
    if (viewMode !== 'edition') {
      return null
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
                ref={mergedRef}
                id={id}
                value={password}
                onChange={handleChange}
                onClick={(e) => {
                  setIsPopoverOpen(true)
                  props.onClick?.(e)
                }}
                className={cn('pr-9', className)}
                disabled={disabled}
                aria-invalid={hasError}
                aria-label={!label ? 'Password input' : undefined}
                aria-required={required}
                type={showPassword ? 'text' : 'password'}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern?.source}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
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
            {/* TODO: Implement PasswordStrengthMeter */}
            {showPasswordStrength && (
              <div className={cn('w-full flex flex-col gap-4 px-4 pt-2 pb-4 rounded-md')}>
                <div className={cn('w-full flex flex-col gap-2')}>
                  <h3 className={cn('text-sm font-semibold text-gray-900')}>Password strength</h3>
                  <ProgressBar value={33} className="[&_[data-slot=progress-bar-indicator]]:bg-red-900" />
                  <span className={cn('text-xs font-medium text-gray-600')}>Weak</span>
                </div>

                <hr className={cn('w-full border-t border-gray-300')} />

                <div className={cn('w-full flex flex-col gap-4')}>
                  <h4 className={cn('text-sm leading-[18px] font-medium text-gray-500')}>Suggestion</h4>
                  <FormMessageList
                    messages={[
                      'At least one lowercase',
                      'At least one uppercase',
                      'At least one numeric',
                      'Minimum 8 characters',
                    ]}
                    className={cn('gap-2 [&>li]:text-gray-500 [&>li]:before:bg-gray-500')}
                  />
                </div>
              </div>
            )}
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
