import { forwardRef, useId } from 'react'
import {
  FormDescription,
  FormGroup,
  FormLabel,
  FormMessageList,
} from '../../../../scalars/components/fragments/index.js'
import { cn } from '../../../../scalars/lib/utils.js'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import { BasePickerField } from '../date-time-picker/base-picker.js'
import { Calendar, type CalendarProps } from './subcomponents/calendar/calendar.js'
import type { DateFieldValue } from './types.js'
import { useDatePickerField } from './use-date-picker.js'
import DateInputDiff from './subcomponents/date-picker-diff/date-picker-diff.js'

interface DatePickerProps
  extends InputBaseProps<DateFieldValue>,
    Omit<CalendarProps, 'mode' | 'handleCalendarMonthYearSelect'>,
    WithDifference<DateFieldValue> {
  label?: string
  id?: string
  name: string
  disabled?: boolean
  required?: boolean
  value?: DateFieldValue
  defaultValue?: DateFieldValue
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  inputProps?: Omit<InputBaseProps<DateFieldValue>, 'name' | 'onChange' | 'value' | 'defaultValue' | 'onBlur'>
  minDate?: string
  maxDate?: string
  disablePastDates?: boolean
  disableFutureDates?: boolean
  dateFormat?: string
  weekStart?: string
  autoClose?: boolean
  className?: string
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      id: propId,
      errors,
      name,
      disabled,
      required,
      value,
      defaultValue,
      placeholder,
      description,
      warnings,
      onChange,
      onBlur,
      inputProps,
      disablePastDates,
      disableFutureDates,
      dateFormat,
      weekStart,
      autoClose = false,
      minDate,
      maxDate,
      // diff props
      viewMode = 'edition',
      baseValue,
      // display props
      className,
      ...props
    },
    ref
  ) => {
    const {
      date,
      inputValue,
      handleDateSelect,
      handleInputChange,
      isOpen,
      setIsOpen,
      handleBlur,
      disabledDates,
      weekStartDay,
      handleDayClick,
      handleCalendarMonthYearSelect,
    } = useDatePickerField({
      value,
      defaultValue,
      onChange,
      onBlur,
      disablePastDates,
      disableFutureDates,
      dateFormat,
      weekStart,
      autoClose,
      minDate,
      maxDate,
    })
    const generatedId = useId()
    const id = propId ?? generatedId

    if (viewMode === 'edition') {
      return (
        <FormGroup>
          {label && (
            <FormLabel htmlFor={id} required={required} disabled={disabled} hasError={!!errors?.length}>
              {label}
            </FormLabel>
          )}
          <BasePickerField
            ref={ref}
            id={id}
            value={inputValue}
            name={name}
            disabled={disabled}
            required={required}
            iconName="CalendarTime"
            placeholder={placeholder}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onInputChange={handleInputChange}
            inputProps={inputProps}
            handleBlur={handleBlur}
            data-cast={`DateString:${dateFormat}`}
            className={String.raw`
          [&.base-picker\\_\\_popover]:px-4
          [&.base-picker\\_\\_popover]:pb-6
          [&.base-picker\\_\\_popover]:pt-3
          ${className}
        `}
          >
            <Calendar
              mode="single"
              selected={date}
              dateFormat={dateFormat}
              handleCalendarMonthYearSelect={handleCalendarMonthYearSelect}
              weekStartsOn={weekStartDay}
              onSelect={handleDateSelect}
              disabled={disabledDates}
              onDayClick={handleDayClick}
              className={cn(
                'w-full',
                'p-0',
                // dark
                'dark:text-gray-500',
                // custom styles
                'font-inter',
                'text-[14px]',
                'font-semibold',
                'leading-[22px]',
                className
              )}
              weekdaysClassName={cn('h-[34px]', 'gap-x-[3px]', 'dark:text-gray-600')}
              monthGridClassName={cn('w-full', 'px-[5.5px]')}
              dayClassName={cn(
                'w-[34px] cursor-pointer text-[12px] text-gray-900 hover:rounded-[4px] hover:bg-gray-200',
                // dark
                'dark:text-gray-50 dark:hover:bg-gray-900',
                'disabled:text-gray-300',
                // Remove hover when selected
                'aria-selected:hover:bg-gray-900 dark:aria-selected:hover:bg-gray-50',
                // Selected state
                'aria-selected:!bg-gray-900 aria-selected:!text-white',
                // Dark mode selected state
                'dark:aria-selected:!bg-gray-50 dark:aria-selected:!text-gray-900'
              )}
              buttonPreviousClassName={cn(
                'border border-gray-200',
                // hover
                'hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900',
                // dark
                'dark:border-gray-900 dark:text-gray-300'
              )}
              buttonNextClassName={cn(
                'border border-gray-200',
                // hover
                'hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900',
                // dark
                'dark:border-gray-900 dark:text-gray-300'
              )}
              todayClassName={cn(
                'rounded-[4px]',
                'bg-gray-100',
                // dark
                'dark:bg-gray-900 dark:text-gray-50',
                // When selected, apply these styles with !important to ensure priority
                'aria-selected:!bg-gray-900 aria-selected:!text-white'
              )}
              selectedClassName={cn(
                'rounded-[4px]',
                '!bg-gray-900 !text-white',
                'hover:bg-gray-900 hover:text-white',
                // dark
                'dark:bg-gray-50 dark:text-gray-900',
                'dark:hover:bg-gray-50 dark:hover:text-gray-900'
              )}
              dayButtonClassName={cn('text-[12px] font-medium')}
              weekClassName={cn('w-full')}
              disabledClassName={cn(
                '!cursor-not-allowed !text-gray-300 hover:!bg-transparent [&>button]:hover:!bg-transparent'
              )}
              {...props}
            />
          </BasePickerField>
          {description && <FormDescription>{description}</FormDescription>}
          {warnings && <FormMessageList messages={warnings} type="warning" />}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }
    return (
      <DateInputDiff
        value={value}
        viewMode={viewMode}
        diffMode="sentences"
        baseValue={baseValue}
        icon="CalendarTime"
        label={label}
        required={required}
        data-testid="date-picker-diff"
        dateFormat={dateFormat}
      />
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker, type DatePickerProps }
