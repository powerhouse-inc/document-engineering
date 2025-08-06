import { forwardRef, useId, useState } from 'react'
import type { InputNumberProps } from './types.js'
import { useNumberInput } from './use-number-input.js'
import { regex } from './utils.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/form-group.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/form-label.js'
import { Icon } from '../../icon/index.js'
import { FormDescription } from '../../../../scalars/components/fragments/form-description/form-description.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { cn } from '../../../../scalars/lib/index.js'
import { Input } from '../input/index.js'
import TextInputDiff from '../text-input/text-input-diff.js'
import type { WithDifference } from '../../../../scalars/components/types.js'
import { de } from 'date-fns/locale'

type InputNumberPropsWithDifference = InputNumberProps & WithDifference<string | number | bigint>

const NumberInputRaw = forwardRef<HTMLInputElement, InputNumberPropsWithDifference>(
  (
    {
      label,
      name,
      description,
      value,
      defaultValue,
      onChange,
      onBlur,
      errors,
      warnings,
      className,
      id: propId,
      minValue,
      maxValue,
      step = 1,
      pattern,
      trailingZeros = false,
      numericType = 'Float',
      precision = 0,
      // Difference Props
      baseValue,
      viewMode = 'edition',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId
    const {
      canIncrement,
      canDecrement,
      preventInvalidCharsAndHandleArrows,
      stepValueHandler,
      blockInvalidPaste,
      preventLetterInput,
      isBigInt,
      handleBlur,
      buttonRef,
    } = useNumberInput({
      value,
      maxValue,
      minValue,
      step,
      onChange,
      numericType,
      onBlur,
      trailingZeros,
      precision,
    })
console.log({
  value,
  defaultValue,
})
    if (viewMode === 'edition') {
      return (
        <FormGroup>
          {label && (
            <FormLabel
              htmlFor={id}
              required={props.required}
              disabled={props.disabled}
              hasError={!!errors?.length}
              className="mb-[3px]"
            >
              {label}
            </FormLabel>
          )}
          <div className="relative flex items-center group">
            <Input
              id={id}
              name={name}
              className={cn('pr-8', className)}
              pattern={isBigInt ? regex.toString() : pattern?.toString()}
              type="text"
              inputMode="numeric"
              role="spinbutton"
              min={minValue}
              max={maxValue}
              aria-valuemin={minValue}
              aria-valuemax={maxValue}
              aria-invalid={!!errors?.length}
              onKeyDown={(e) => {
                preventLetterInput(e)
                preventInvalidCharsAndHandleArrows(e)
              }}
              value={value !== undefined ? value.toString() : defaultValue !== undefined ? defaultValue.toString() : ''}
              onBlur={handleBlur}
              onChange={onChange}
              onPaste={blockInvalidPaste}
              ref={ref}
              data-cast={isBigInt ? 'BigInt' : 'Number'}
              {...props}
            />
            <div className="absolute inset-y-2 right-3 flex flex-col justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
              <button
                aria-label="Increment"
                disabled={canIncrement}
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
                type="button"
                onClick={(e) => {
                  stepValueHandler(e, 'increment')
                  if (buttonRef.current) {
                    buttonRef.current.focus()
                  }
                }}
              >
                <Icon
                  size={10}
                  name="ChevronDown"
                  className={cn('rotate-180 text-gray-700 dark:text-gray-300', canIncrement && 'cursor-not-allowed')}
                />
              </button>
              <button
                aria-label="Decrement"
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
                disabled={canDecrement}
                type="button"
                onClick={(e) => {
                  stepValueHandler(e, 'decrement')
                  if (buttonRef.current) {
                    buttonRef.current.focus()
                  }
                }}
              >
                <Icon
                  size={10}
                  name="ChevronDown"
                  className={cn(
                    'items-center justify-center text-gray-700 dark:text-gray-300',
                    canDecrement && 'cursor-not-allowed'
                  )}
                />
              </button>
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {warnings && <FormMessageList messages={warnings} type="warning" />}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }
    return (
      <TextInputDiff
        value={value ?? defaultValue ?? ''}
        viewMode={viewMode}
        diffMode="sentences"
        baseValue={baseValue ?? ''}
        label={label}
        required={props.required}
        data-testid="number-input-diff"
      />
    )
  }
)

NumberInputRaw.displayName = 'NumberInputRaw'

const NumberInputUncontroller = forwardRef<HTMLInputElement, InputNumberPropsWithDifference>((props, ref) => {
  const [value, setValue] = useState(props.value ?? props.defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue as unknown as number)
  }
  return <NumberInputRaw {...props} value={value} onChange={handleChange} ref={ref} />
})
NumberInputUncontroller.displayName = 'NumberInputUncontroller'

const NumberInput = forwardRef<HTMLInputElement, InputNumberPropsWithDifference>((props, ref) => {
  if (props.onChange) {
    return <NumberInputRaw {...props} ref={ref} />
  }
  return <NumberInputUncontroller {...props} ref={ref} />
})

NumberInput.displayName = 'NumberInput'

export { NumberInput }
