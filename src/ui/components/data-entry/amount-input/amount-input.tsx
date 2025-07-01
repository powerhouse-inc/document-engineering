import { forwardRef, useId, useState } from 'react'
import {
  FormDescription,
  FormGroup,
  FormLabel,
  FormMessageList,
} from '../../../../scalars/components/fragments/index.js'
import { cn } from '../../../../scalars/lib/utils.js'
import { type Currency, CurrencyCodePicker } from '../currency-code-picker/index.js'
import type { SelectProps } from '../select/index.js'
import type { Amount, AmountInputPropsGeneric, AmountValue } from './types.js'
import { useAmountInput } from './use-amount-input.js'
import { NumberInput } from '../number-input/index.js'
import type { InputNumberProps } from '../number-input/types.js'
import type { WithDifference } from '#scalars'
import { AmountInputDiff } from './subcomponents/amount-input-diff.js'

type AdditionalProps = Omit<InputNumberProps, 'onChange' | 'onBlur' | 'precision' | 'value' | 'defaultValue'> & {
  className?: string
  name: string
  numberProps?: Omit<InputNumberProps, 'name'>
  selectProps?: Omit<SelectProps, 'placeholder' | 'selectionIcon' | 'onBlur' | 'baseValue' | 'defaultValue' | 'value'>
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

type AmountInputUncontrollerProps = AmountInputUncontrollerMain & AdditionalProps & WithDifference<AmountValue>

type AmountInputProps = AmountInputPropsGeneric & AdditionalProps & WithDifference<AmountValue>

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
      // Diff Props
      baseValue,
      viewMode = 'edition',
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

    if (viewMode === 'edition') {
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
          <div
            className={cn(
              'relative flex items-center',
              'rounded-md border border-gray-300',
              'h-[36px]',
              // focus state
              'focus:rounded-md focus:border-gray-900 transition-colors focus-within:ring-1 focus-within:rounded focus-within:ring-offset-0'
            )}
          >
            <input name={name} type="hidden" data-cast={isBigInt ? 'AmountBigInt' : 'AmountNumber'} />
            {isShowSelect && currencyPosition === 'left' && (
              <CurrencyCodePicker
                contentAlign="start"
                contentClassName="[&]:!w-[120px]"
                disabled={disabled}
                currencies={options}
                value={valueSelect}
                onChange={handleOnChangeSelect}
                placeholder={placeholderSelect}
                includeCurrencySymbols={includeCurrencySymbols}
                symbolPosition={symbolPosition}
                searchable={false}
                className={cn(
                  'focus:border-r-none focus:z-10 focus:ring-0 focus:ring-offset-0 focus:bg-none',
                  'outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'h-[32px]',
                  'hover:bg-transparent',
                  'border-none',
                  selectProps?.className
                )}
                {...(selectProps ?? { name: '' })}
              />
            )}
            {isShowSelect && currencyPosition === 'left' && (
              <div className="border-l-[1px] border-gray-300 h-full flex items-center" />
            )}
            <div className={cn('relative flex items-center')}>
              <NumberInput
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
                numericType={type === 'AmountCurrency' || type === 'AmountCrypto' ? 'BigInt' : 'Float'}
                className={cn(
                  currencyPosition === 'left' && 'rounded-l-none border-l-[0.5px]',
                  currencyPosition === 'right' && 'rounded-r-none border-r-[0.5px]',
                  isPercent && 'rounded-md pr-7',
                  isAmountWithoutUnit && 'rounded-md',
                  'outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'border-none',
                  'h-[32px]',
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
              <div className="border-l-[1px] border-gray-300 h-full flex items-center" />
            )}
            {isShowSelect && currencyPosition === 'right' && (
              <CurrencyCodePicker
                contentAlign="end"
                contentClassName="[&]:!w-[120px]"
                className={cn(
                  'focus:border-l-none focus:z-10 focus:ring-0 focus:ring-offset-0 focus:bg-none',
                  'outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'h-[32px]',
                  'hover:bg-transparent',
                  'border-none',
                  selectProps?.className
                )}
                disabled={disabled}
                includeCurrencySymbols={includeCurrencySymbols}
                currencies={options}
                value={valueSelect}
                onChange={handleOnChangeSelect}
                name=""
                placeholder={placeholderSelect}
                symbolPosition={symbolPosition}
                searchable={false}
                {...(selectProps ?? { name: '' })}
              />
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {warnings && <FormMessageList messages={warnings} type="warning" />}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }
    return (
      <AmountInputDiff
        value={value}
        baseValue={baseValue}
        viewMode={viewMode}
        required={required}
        label={label}
        currencyPosition={currencyPosition}
        options={options}
        symbolPosition={symbolPosition}
        includeCurrencySymbols={includeCurrencySymbols}
      />
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
