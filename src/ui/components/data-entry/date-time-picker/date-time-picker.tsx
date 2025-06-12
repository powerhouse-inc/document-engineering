import {
  FormDescription,
  FormGroup,
  FormLabel,
  FormMessageList,
} from '../../../../scalars/components/fragments/index.js'
import type { InputBaseProps } from '../../../../scalars/components/types.js'
import { type ChangeEvent, type FocusEvent, forwardRef } from 'react'
import type { DateFieldValue } from '../date-picker/types.js'
import { BasePickerField } from './base-picker.js'
import DateTimePickerContent from './date-time-picker-content.js'
import { useDateTimePicker } from './use-date-time-picker.js'

interface DateTimePickerProps extends InputBaseProps<DateFieldValue> {
  name: string
  id?: string
  label?: string
  value?: DateFieldValue
  defaultValue?: DateFieldValue
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  timeFormat?: string
  timeIntervals?: number
  timeZone?: string
  showTimezoneSelect?: boolean
  includeContinent?: boolean
  // Date Picker Field
  disablePastDates?: boolean
  disableFutureDates?: boolean
  dateFormat?: string
  weekStart?: string
  autoClose?: boolean
  minDate?: string
  maxDate?: string
  onChangeDate?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlurDate?: (e: FocusEvent<HTMLInputElement>) => void
  className?: string
}
const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      name,
      id,
      label,
      value,
      defaultValue,
      errors,
      disabled,
      required,
      placeholder,
      description,
      warnings,
      onChange,
      onBlur,

      // Date Picker Field
      disablePastDates,
      disableFutureDates,
      dateFormat,
      weekStart,
      autoClose,
      minDate,
      maxDate,
      onChangeDate,
      onBlurDate,
      timeFormat,
      // Time Picker Field
      timeIntervals,
      timeZone,
      showTimezoneSelect,
      includeContinent,
      className,
      ..._props
    },
    ref
  ) => {
    const {
      isOpen,
      setIsOpen,
      // inputValue,
      activeTab,
      onChangeTabs,
      isCalendarView,
      dateTimeToDisplay,
      handleInputChangeField,

      // Date Picker Field
      date,
      handleDateSelect,
      disabledDates,
      weekStartDay,
      handleDayClick,
      handleOnBlur,

      // Time Picker Field
      selectedHour,
      selectedMinute,
      selectedPeriod,
      setSelectedHour,
      setSelectedMinute,
      setSelectedPeriod,
      hours,
      minutes,
      onCancel,
      handleSave,
      timeZonesOptions,
      selectedTimeZone,
      is12HourFormat,
      setSelectedTimeZone,
      isDisableSelect,
    } = useDateTimePicker({
      value,
      defaultValue,
      onChange,
      onBlur,
      // Date Picker Field
      autoClose,
      disableFutureDates,
      disablePastDates,
      dateFormat,
      weekStart,
      onChangeDate,
      onBlurDate,
      minDate,
      maxDate,

      // Time Picker Field
      timeFormat,
      timeIntervals,
      timeZone,
      showTimezoneSelect,
      includeContinent,
    })
    return (
      <FormGroup>
        {label ? (
          <FormLabel htmlFor={id} required={required} disabled={disabled} hasError={!!errors?.length}>
            {label}
          </FormLabel>
        ) : null}
        <BasePickerField
          ref={ref}
          label={label}
          id={id}
          value={dateTimeToDisplay}
          name={name}
          errors={errors}
          disabled={disabled}
          required={required}
          iconName="CalendarTime"
          placeholder={placeholder}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onInputChange={handleInputChangeField}
          handleBlur={handleOnBlur}
          data-cast={`DateTimeString:${dateFormat}`}
          className={String.raw`
            [&.base-picker\\_\\_popover]:px-4
            [&.base-picker\\_\\_popover]:pt-3
            [&.base-picker\\_\\_popover]:${isCalendarView ? 'pb-6' : 'pb-4'}
            ${className}
          `}
        >
          <DateTimePickerContent
            activeTab={activeTab}
            onChangeTabs={onChangeTabs}
            // Date Picker Field
            date={date}
            handleDateSelect={handleDateSelect}
            disabledDates={disabledDates}
            weekStartDay={weekStartDay}
            handleDayClick={handleDayClick}
            // Time Picker Field
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            selectedPeriod={selectedPeriod}
            setSelectedHour={setSelectedHour}
            setSelectedMinute={setSelectedMinute}
            setSelectedPeriod={setSelectedPeriod}
            hours={hours}
            minutes={minutes}
            timeZonesOptions={timeZonesOptions}
            selectedTimeZone={selectedTimeZone as string}
            setSelectedTimeZone={setSelectedTimeZone}
            timeZone={timeZone}
            is12HourFormat={is12HourFormat}
            isDisableSelect={isDisableSelect}
            onCancel={onCancel}
            onSave={handleSave}
          />
        </BasePickerField>
        {description ? <FormDescription>{description}</FormDescription> : null}
        {warnings ? <FormMessageList messages={warnings} type="warning" /> : null}
        {errors ? <FormMessageList messages={errors} type="error" /> : null}
      </FormGroup>
    )
  }
)

DateTimePicker.displayName = 'DateTimePicker'

export { DateTimePicker, type DateTimePickerProps }
