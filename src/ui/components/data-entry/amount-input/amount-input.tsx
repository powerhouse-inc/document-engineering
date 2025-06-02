import { forwardRef, useId, useState } from 'react'
import {
  FormDescription,
  FormGroup,
  FormLabel,
  FormMessageList,
} from '../../../../scalars/components/fragments/index.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { type Currency, CurrencyCodePicker } from '../currency-code-picker/index.js'
import type { SelectFieldProps } from '../../../../scalars/components/fragments/select-field/index.js'
import { NumberFieldRaw } from '../../../../scalars/components/number-field/index.js'
import type { InputNumberProps, NumberFieldProps } from '../../../../scalars/components/number-field/types.js'
import type { Amount, AmountInputPropsGeneric } from './types.js'
import { useAmountInput } from './use-amount-input.js'

type AdditionalProps = Omit<InputNumberProps, 'onChange' | 'onBlur' | 'precision'> & {
  className?: string
  name: string
  numberProps?: Omit<NumberFieldProps, 'name'>
  selectProps?: Omit<SelectFieldProps, 'placeholder' | 'selectionIcon' | 'onBlur'>
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  currencyPosition?: 'left' | 'right'
  symbolPosition?: 'left' | 'right'
  allowNegative?: boolean
  viewPrecision?: number
  precision?: number
  placeholderSelect?: string
  units?: Currency[]
  includeCurrencySymbols?: boolean
}

interface AmountInputUncontrollerMain {
  type: 'Amount'
  value?: Amount
  defaultValue?: Amount
  trailingZeros?: boolean
}

type AmountInputUncontrollerProps = AmountInputUncontrollerMain & AdditionalProps

type AmountInputProps = AmountInputPropsGeneric & AdditionalProps

const AmountInputController = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      label,
      value,
      id: propId,
      minValue,
      maxValue,
      onChange,
      onBlur,
      disabled,
      className,
      required,
      errors,
      warnings,
      description,
      defaultValue,
      type,
      numberProps,
      selectProps,
      step = 1,
      currencyPosition = 'right',
      name,
      trailingZeros,
      viewPrecision,
      precision,
      placeholder,
      placeholderSelect,
      units,
      includeCurrencySymbols,
      symbolPosition,
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId
    const {
      isShowSelect,
      isPercent,
      options,
      valueSelect,
      valueInput,
      handleOnChangeInput,
      handleOnChangeSelect,
      handleBlur,
      isBigInt,
      handleIsInputFocused,
      isAmountWithoutUnit,
      inputFocused,
    } = useAmountInput({
      value,
      defaultValue,
      type,
      onChange,
      onBlur,
      precision,
      viewPrecision,
      trailingZeros,
      units,
    })

    return (
      <FormGroup>
        {label && (
          <FormLabel
            htmlFor={id}
            required={required}
            disabled={disabled}
            hasError={!!errors?.length}
            className={cn(disabled && 'mb-[3px]')}
          >
            {label}
          </FormLabel>
        )}
        <div className={cn('relative flex items-center')}>
          <input name={name} type="hidden" data-cast={isBigInt ? 'AmountBigInt' : 'AmountNumber'} />
          <div className={cn('relative flex items-center')}>
            {isShowSelect && currencyPosition === 'left' && (
              <CurrencyCodePicker
                contentAlign="start"
                contentClassName="[&]:!w-[120px] w-full"
                disabled={disabled}
                currencies={options}
                onChange={handleOnChangeSelect}
                placeholder={placeholderSelect}
                includeCurrencySymbols={includeCurrencySymbols}
                symbolPosition={symbolPosition}
                searchable={false}
                className={cn(
                  'rounded-l-md rounded-r-none border border-gray-300',
                  'border-r-[0.5px]',
                  // focus state
                  'focus:border-r-none focus:z-10 focus:ring-1 focus:ring-gray-900 focus:ring-offset-0',
                  'focus:outline-none',

                  selectProps?.className
                )}
                {...(selectProps ?? { name: '' })}
              />
            )}
            <NumberFieldRaw
              name=""
              step={step}
              required={required}
              disabled={disabled}
              value={valueInput === undefined ? undefined : (valueInput as unknown as number)}
              id={id}
              maxValue={maxValue}
              precision={precision}
              minValue={minValue}
              onChange={handleOnChangeInput}
              onFocus={handleIsInputFocused}
              placeholder={placeholder}
              className={cn(
                currencyPosition === 'left' && 'rounded-l-none border-l-[0.5px]',
                currencyPosition === 'right' && 'rounded-r-none border-r-[0.5px]',
                isPercent && 'rounded-md pr-7',
                isAmountWithoutUnit && 'rounded-md',
                className
              )}
              onBlur={handleBlur}
              ref={ref}
              {...(numberProps || {})}
            />
            {isPercent && !inputFocused && (
              <span
                className={cn(
                  'pointer-events-none absolute inset-y-0 right-2 ml-2 flex items-center',
                  disabled ? 'text-gray-400' : 'text-gray-900'
                )}
              >
                %
              </span>
            )}
          </div>

          {isShowSelect && currencyPosition === 'right' && (
            <CurrencyCodePicker
              contentAlign="end"
              contentClassName="[&]:!w-[120px] w-full"
              disabled={disabled}
              includeCurrencySymbols={includeCurrencySymbols}
              currencies={options}
              value={valueSelect}
              onChange={handleOnChangeSelect}
              name=""
              placeholder={placeholderSelect}
              symbolPosition={symbolPosition}
              searchable={false}
              className={cn(
                'rounded-l-none rounded-r-md border border-gray-300',
                'border-l-[0.5px]',
                // focus state
                'focus:border-l-none focus:z-10 focus:ring-1 focus:ring-gray-900 focus:ring-offset-0',
                'focus:outline-none',
                selectProps?.className
              )}
            />
          )}
        </div>
        {description && <FormDescription>{description}</FormDescription>}
        {warnings && <FormMessageList messages={warnings} type="warning" />}
        {errors && <FormMessageList messages={errors} type="error" />}
      </FormGroup>
    )
  }
)
AmountInputController.displayName = 'AmountInputController'

const AmountInputUncontroller = (props: AmountInputUncontrollerProps) => {
  const [value, setValue] = useState(props.value ?? props.defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue as Amount)
  }
  return <AmountInputController {...props} value={value} onChange={handleChange} />
}

const AmountInput = (props: AmountInputProps) => {
  if (props.onChange) {
    return <AmountInputController {...props} />
  }
  return <AmountInputUncontroller {...(props as AmountInputUncontrollerProps)} />
}

AmountInput.displayName = 'AmountInput'

export { AmountInput, type AmountInputProps }
