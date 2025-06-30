import React, { useState } from 'react'
import type { DateFieldValue } from '../date-picker/types.js'
import { useDatePickerField } from '../date-picker/use-date-picker.js'
import { getTimeFromValue, isFormatDisabled } from '../date-picker/utils.js'
import type { TimePeriod } from '../time-picker/type.js'
import { convertTimeFrom24To12Hours, useTimePicker } from '../time-picker/use-time-picker.js'
import {
  cleanTime,
  convert12hTo24h,
  createChangeEvent,
  formatInputsToValueFormat,
  formatInputToDisplayValid,
  getHoursAndMinutes,
  isValidTimeInput,
} from '../time-picker/utils.js'
import {
  createBlurEvent,
  formatToISODateTimeWithOffset,
  getDateFormat,
  getOffset,
  isDateFormatAllowed,
  parseDateTimeValueToInput,
  putDateInValue,
  putTimeInValue,
  splitDateTimeStringFromInput,
  todayDateInput,
} from './utils.js'
import { format } from 'date-fns'

interface DateTimeFieldProps {
  value?: DateFieldValue
  defaultValue?: DateFieldValue

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void

  // Date Picker Field
  autoClose?: boolean
  disableFutureDates?: boolean
  disablePastDates?: boolean
  dateFormat?: string
  onBlurDate?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChangeDate?: (e: React.ChangeEvent<HTMLInputElement>) => void
  minDate?: string
  maxDate?: string
  weekStart?: string

  // Time Picker Field
  onChangeTime?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlurTime?: (e: React.FocusEvent<HTMLInputElement>) => void
  timeFormat?: string
  timeIntervals?: number
  timeZone?: string
  showTimezoneSelect?: boolean
  includeContinent?: boolean
}

export const useDateTimePicker = ({
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
  minDate,
  maxDate,

  // Time Picker Field
  timeFormat = 'h:mm a',
  timeIntervals = 1,
  timeZone,
  showTimezoneSelect = true,
  includeContinent,
}: DateTimeFieldProps) => {
  const internalFormat = getDateFormat(dateFormat ?? '')
  const is12HourFormat = timeFormat.includes('a') || timeFormat.includes('A')
  const isYearFormat = dateFormat === 'YYYY'
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date')
  const [dateTimeToDisplay, setDateTimeToDisplay] = useState(
    parseDateTimeValueToInput(value ?? defaultValue ?? '', internalFormat, is12HourFormat, timeIntervals)
  )

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: parse date and time to correct format
    const date = e.target.value
    const newValue = putDateInValue(value ?? defaultValue ?? '', date)
    const newVInput = parseDateTimeValueToInput(newValue, internalFormat, is12HourFormat, timeIntervals)

    const splitTime = newVInput.split(' ')[1]
    const splitDate = newVInput.split(' ')[0]
    const periodCheck = Number(newValue.split('T')[1].split(':')[0]) > 12 ? 'PM' : 'AM'

    const transformedTime = formatInputToDisplayValid(splitTime, is12HourFormat, timeIntervals, periodCheck)
    const { hours, minutes, period } = getHoursAndMinutes(transformedTime)

    setSelectedHour(cleanTime(hours))
    setSelectedMinute(cleanTime(minutes))
    if (is12HourFormat) {
      setSelectedPeriod(period as TimePeriod)
    }
    const inputDisplay = `${splitDate.toLocaleUpperCase()} ${transformedTime}`
    setDateTimeToDisplay(inputDisplay)
    onChange?.(createChangeEvent(newValue))
    // Add onBlur event to update the value when select a date from calendar
    onBlur?.(createBlurEvent(newValue))
  }

  const { date, handleDateSelect, handleInputChange, handleBlur, disabledDates, weekStartDay } = useDatePickerField({
    value,
    defaultValue,
    onChange: onChangeDate,
    // Specific for DatePickerField
    dateFormat,
    disablePastDates,
    disableFutureDates,
    autoClose,
    weekStart,
    minDate,
    maxDate,
  })

  const timeInput = getTimeFromValue(value ?? defaultValue ?? '')

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(false)
    const time = e.target.value

    const newValue = putTimeInValue(value ?? defaultValue ?? '', time)
    const newVInput = parseDateTimeValueToInput(newValue, internalFormat, is12HourFormat, timeIntervals)
    setDateTimeToDisplay(newVInput)
    onChange?.(createChangeEvent(newValue))
  }

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const currentValue = value ?? defaultValue ?? ''

    if (!currentValue.toString().includes('T') || currentValue.toString().includes(' ')) {
      onChange?.(createChangeEvent(inputValue))
      onBlur?.(createBlurEvent(inputValue))
      return
    }
    if (!inputValue) {
      setDateTimeToDisplay(inputValue)
      onChange?.(createChangeEvent(''))
      onBlur?.(createBlurEvent(''))
      return
    }
    // Get the time and transform to 24 hours format and avoid undefined
    const inputSplited = inputValue.split(' ')
    const timeValue = inputSplited[1] ?? ''
    // Get period from input if exists
    const periodInput = inputSplited[2] as TimePeriod

    if (!isValidTimeInput(timeValue)) {
      if (inputValue === '') {
        setDateTimeToDisplay(inputValue)
        onChange?.(createChangeEvent(''))
        onBlur?.(createBlurEvent(''))
        return
      }

      // If the time is not valid, made the onChage and onBlur with the inputValue
      setDateTimeToDisplay(inputValue)
      onChange?.(createChangeEvent(inputValue))
      onBlur?.(createBlurEvent(inputValue))
      return
    }

    const datetimeFormatted = formatInputToDisplayValid(timeValue, is12HourFormat, timeIntervals, periodInput)
    const validValue = convert12hTo24h(datetimeFormatted)
    const offsetUTC = getOffset(timeZone ?? (selectedTimeZone as string))
    const { minutes, hours } = getHoursAndMinutes(validValue)

    const clearMinutes = cleanTime(minutes)
    const clearHours = convertTimeFrom24To12Hours(cleanTime(hours))
    setSelectedHour(clearHours)
    setSelectedMinute(clearMinutes)
    const getFormattedTime = datetimeFormatted.split(' ')[1]
    // Get period from input if exists to avoid use the default period
    const newPeriod =
      datetimeFormatted.includes('AM') || datetimeFormatted.includes('PM')
        ? (datetimeFormatted.split(' ')[1] as TimePeriod)
        : getFormattedTime
    if (is12HourFormat) {
      setSelectedPeriod(newPeriod as TimePeriod)
    }
    const timeFormat = formatInputsToValueFormat(hours, minutes, offsetUTC)
    const newValue = putTimeInValue(value ?? defaultValue ?? '', timeFormat)
    const newVInput = isYearFormat ? newValue.split('T')[0].split('-')[0] : newValue.split('T')[0]

    // Check if the date is empty when split the value by T
    const valueEmptyDate = (value as string | undefined)?.split('T')[0] === ''
    if (valueEmptyDate) {
      setDateTimeToDisplay(inputValue)
      onChange?.(createChangeEvent(inputValue))
      onBlur?.(createBlurEvent(inputValue))
      return
    }

    const valueFormatted = `${newVInput.toUpperCase()} ${datetimeFormatted}`
    setDateTimeToDisplay(valueFormatted)
    onChange?.(createChangeEvent(newValue))
    onBlur?.(createBlurEvent(newValue))
  }

  const {
    selectedHour,
    selectedMinute,
    selectedPeriod,
    setSelectedHour,
    setSelectedMinute,
    setSelectedPeriod,
    hours,
    minutes,
    timeZonesOptions,
    selectedTimeZone,
    setSelectedTimeZone,
    isDisableSelect,
  } = useTimePicker({
    value: timeInput,
    defaultValue: timeInput,
    onChange: onChangeTime,
    onBlur: handleOnBlur,
    timeFormat,
    timeIntervals,
    timeZone,
    showTimezoneSelect,
    includeContinent,
  })

  const handleInputChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (isFormatDisabled(internalFormat, inputValue)) {
      onChange?.(createChangeEvent(inputValue))
    }
    setDateTimeToDisplay(inputValue)
    const { date, time } = splitDateTimeStringFromInput(inputValue)
    const datePartCorrected = isYearFormat ? new Date(Number(date), 0, 1).toISOString() : date
    // const datePartCorrected = isYearFormat ? yearInput : date
    const offset = getOffset(timeZone ?? (selectedTimeZone as string))
    let formattedDateTime = formatToISODateTimeWithOffset(datePartCorrected, time, offset)
    if (!time && !date) {
      formattedDateTime = inputValue
    }
    const [hour, minute] = time.split(':')
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange?.(createChangeEvent(formattedDateTime))
  }

  const onChangeTabs = (value: string) => {
    setActiveTab(value as 'date' | 'time')
  }

  const isCalendarView = activeTab === 'date'

  // Close the calendar when a date is selected, move this to callback
  const handleDayClick = () => {
    if (autoClose) {
      setIsOpen(false)
    }
  }

  const onCancel = () => {
    setIsOpen(false)
  }
  // WIP: need to be refactored to work with the date
  const handleOnSave = () => {
    setIsOpen(false)
    const offsetUTC = timeZone ? getOffset(timeZone) : getOffset(selectedTimeZone as string)
    let periodToUse = selectedPeriod
    if (is12HourFormat && !selectedPeriod) {
      const hourNum = selectedHour && selectedHour !== '' ? parseInt(selectedHour) : 0
      periodToUse = hourNum >= 8 && hourNum <= 11 ? 'AM' : 'PM'
      setSelectedPeriod(periodToUse)
    }
    if (is12HourFormat) {
      setSelectedPeriod(periodToUse)
    }

    setSelectedHour(cleanTime(selectedHour))
    setSelectedMinute(cleanTime(selectedMinute))
    const datetimeFormatted = is12HourFormat
      ? `${selectedHour}:${selectedMinute} ${periodToUse}`
      : `${selectedHour}:${selectedMinute}`
    const convertedTime = convert12hTo24h(datetimeFormatted)
    const [hours, minutes] = convertedTime.split(':')
    const newValueTime = formatInputsToValueFormat(hours, minutes, offsetUTC)
    // If there are no hours and minutes selected, do nothing
    if (!selectedHour && !selectedMinute) {
      return
    }
    // Set default values
    let hourToUse = selectedHour
    if (!selectedHour && selectedMinute) {
      hourToUse = is12HourFormat ? '12' : '00'
      setSelectedHour(hourToUse)
    }
    const timeToDisplay = is12HourFormat
      ? `${hourToUse}:${selectedMinute} ${periodToUse}`
      : `${hourToUse}:${selectedMinute}`

    const newValue = putTimeInValue(value ?? defaultValue ?? '', newValueTime)
    let valueDate = parseDateTimeValueToInput(newValue, internalFormat, is12HourFormat, timeIntervals).split(' ')[0]
    // Check if the date is valid if not add today date to the value
    const isValid = isDateFormatAllowed(valueDate, internalFormat)
    if (!isValid) {
      valueDate = todayDateInput(internalFormat)
    }

    const upperValueDate = valueDate.toUpperCase()
    const upperValueDateYear = isYearFormat ? upperValueDate.split('-')[0] : upperValueDate
    const valueWithFormat = putDateInValue(newValue, upperValueDate)
    const inputDisplay = `${upperValueDateYear} ${timeToDisplay}`
    setDateTimeToDisplay(inputDisplay)
    onChange?.(createChangeEvent(valueWithFormat))
    onBlur?.(createBlurEvent(valueWithFormat))
  }

  const handleCalendarMonthYearSelect = (year: number, monthIndex: number) => {
    const newInputValue = format(new Date(year, monthIndex), internalFormat).toUpperCase()
    const yearInput = new Date(year, 0, 1).toISOString()
    const inputToShow = isYearFormat ? `${year}` : newInputValue
    const newDateTime = putDateInValue(value ?? defaultValue ?? '', inputToShow)
    const newValueDateTimeYear = putDateInValue(value ?? defaultValue ?? '', yearInput)
    const newInputToShow = parseDateTimeValueToInput(newDateTime, internalFormat, is12HourFormat, timeIntervals)

    const dateTimeISO = isYearFormat ? newValueDateTimeYear : newDateTime
    setDateTimeToDisplay(newInputToShow.toUpperCase())
    onChange?.(createChangeEvent(dateTimeISO))
    setIsOpen(false)
  }

  return {
    isOpen,
    setIsOpen,
    activeTab,
    onChangeTabs,
    isCalendarView,
    dateTimeToDisplay,
    handleInputChangeField,
    handleOnBlur,
    date,
    // DatePicker Field
    handleDateSelect,
    handleInputChange,
    handleBlur,
    disabledDates,
    weekStartDay,
    handleDayClick,
    // TimePicker Field
    selectedHour,
    selectedMinute,
    selectedPeriod,
    setSelectedHour,
    setSelectedMinute,
    setSelectedPeriod,
    hours,
    minutes,
    onCancel,
    timeZonesOptions,
    handleSave: handleOnSave,
    selectedTimeZone,
    setSelectedTimeZone,
    is12HourFormat,
    isDisableSelect,
    handleCalendarMonthYearSelect,
  }
}
