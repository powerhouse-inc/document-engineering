import { useMemo, useState } from 'react'
import { createBlurEvent, getOffset } from '../date-time-picker/utils.js'
import type { TimeFieldValue, TimePeriod } from './type.js'
import {
  cleanTime,
  convert12hTo24h,
  createChangeEvent,
  formatInputsToValueFormat,
  formatInputToDisplayValid,
  getHours,
  getHoursAndMinutes,
  getInputValue,
  getMinutes,
  getOffsetToDisplay,
  getOptions,
  getPeriodFromTime,
  getTimezone,
  INVALID_TIME_INPUT,
  isValidTimeInput,
} from './utils.js'

export const convertTimeFrom24To12Hours = (time: string) => {
  if (time === '') return ''
  const hours = Number(time)
  if (isNaN(hours)) return ''
  return String(hours % 12 || 12).padStart(2, '0')
}
interface TimePickerFieldProps {
  value?: TimeFieldValue
  defaultValue?: TimeFieldValue
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  timeFormat?: string
  timeIntervals?: number
  timeZone?: string
  showTimezoneSelect?: boolean
  includeContinent?: boolean
}

export const useTimePicker = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  timeFormat = 'hh:mm a',
  timeIntervals = 1,
  timeZone,
  showTimezoneSelect = true,
  includeContinent = false,
}: TimePickerFieldProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const is12HourFormat = timeFormat.includes('a') || timeFormat.includes('A')
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod | undefined>(
    getPeriodFromTime(value ?? defaultValue ?? '', is12HourFormat)
  )
  const [selectedMinute, setSelectedMinute] = useState(getMinutes(value ?? defaultValue ?? ''))

  const [inputValue, setInputValue] = useState(
    formatInputToDisplayValid(getInputValue(value ?? defaultValue), is12HourFormat, timeIntervals, selectedPeriod)
  )
  const [selectedHour, setSelectedHour] = useState(
    is12HourFormat
      ? convertTimeFrom24To12Hours(getHours(value ?? defaultValue ?? ''))
      : getHours(value ?? defaultValue ?? '')
  )

  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [selectedTimeZone, setSelectedTimeZone] = useState<string | string[] | undefined>(
    timeZone || (!showTimezoneSelect ? systemTimezone : getTimezone(value ?? defaultValue ?? ''))
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setInputValue(input)
    const offsetUTC = getOffset(selectedTimeZone as string)
    const { minutes, hours } = getHoursAndMinutes(input)
    const datetime = formatInputsToValueFormat(hours, minutes, offsetUTC)
    const newDatetime = datetime === '' ? INVALID_TIME_INPUT : datetime
    const period = getPeriodFromTime(newDatetime, is12HourFormat)
    // Get period from input if exists to avoid use the default period
    const newPeriod = input.includes('AM') || input.includes('PM') ? (input.split(' ')[1] as TimePeriod) : period

    setSelectedPeriod(newPeriod)
    onChange?.(createChangeEvent(newDatetime))
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (!isValidTimeInput(input)) {
      onChange?.(createChangeEvent(INVALID_TIME_INPUT))
      onBlur?.(createBlurEvent(INVALID_TIME_INPUT))
      return
    }
    // Get the period from the input if exists to avoid use the default period
    const inputPeriod = input.split(' ')[1] as TimePeriod

    const validDisplay = formatInputToDisplayValid(input, is12HourFormat, timeIntervals, inputPeriod)

    const valueForInput = isValidTimeInput(input) ? validDisplay : input
    setInputValue(valueForInput)

    const validValue = convert12hTo24h(valueForInput)

    const { minutes, hours } = getHoursAndMinutes(validValue)

    const offsetUTC = getOffset(selectedTimeZone as string)

    const datetime = formatInputsToValueFormat(hours, minutes, offsetUTC)
    const clearMinutes = cleanTime(minutes)
    const clearHours = is12HourFormat ? convertTimeFrom24To12Hours(cleanTime(hours)) : cleanTime(hours)
    setSelectedHour(clearHours)
    setSelectedMinute(clearMinutes)
    onChange?.(createChangeEvent(datetime))
    onBlur?.(createBlurEvent(validDisplay))
  }

  // Generate hours according to the format
  const hours = is12HourFormat
    ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')) // 1-12
    : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')) // 0-23

  const minutes = useMemo(() => {
    if (timeIntervals > 1) {
      const arr: string[] = []
      for (let i = 0; i < 60; i += timeIntervals) {
        arr.push(String(i).padStart(2, '0'))
      }
      return arr
    }
    return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
  }, [timeIntervals])

  const handleSave = () => {
    setIsOpen(false)
    const offsetUTC = timeZone ? getOffset(timeZone) : getOffset(selectedTimeZone as string)

    // If there are no hours and minutes selected, do nothing
    if (!selectedHour && !selectedMinute) {
      return
    }
    // Set default values
    let hourToUse = selectedHour
    if (!selectedHour && selectedMinute) {
      hourToUse = is12HourFormat ? '12' : '00'
    }

    let periodToUse = selectedPeriod
    if (is12HourFormat && !selectedPeriod) {
      const hourNum = parseInt(selectedHour)
      periodToUse = hourNum >= 8 && hourNum <= 11 ? 'AM' : 'PM'
      setSelectedPeriod(periodToUse)
    }

    // Condition that if the format is 12 hours and there are no minutes selected and there are no minutes selected adds a 00
    let minuteToUse = selectedMinute
    if (!selectedMinute) {
      minuteToUse = '00'
    }

    // Value to display in the input get values from the popover interface
    const valueToDisplay = is12HourFormat ? `${hourToUse}:${minuteToUse} ${periodToUse}` : `${hourToUse}:${minuteToUse}`
    setInputValue(valueToDisplay)

    // Convert the value to display ISO time format
    const validValue = convert12hTo24h(valueToDisplay)

    const { minutes, hours } = getHoursAndMinutes(validValue)
    const datetime = formatInputsToValueFormat(hours, minutes, offsetUTC)
    onChange?.(createChangeEvent(datetime))
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const options = useMemo(() => {
    return getOptions(includeContinent)
  }, [includeContinent])

  // if timeZone, then the options of select will be that timeZone and the offset
  const isDisableSelect = timeZone || !showTimezoneSelect ? true : false
  const timeZonesOptions =
    timeZone || !showTimezoneSelect
      ? [
          options.find((opt) => opt.value === (timeZone || systemTimezone)) || {
            label: `(${getOffsetToDisplay(timeZone || systemTimezone)}) ${
              includeContinent
                ? (timeZone || systemTimezone).replace(/_/g, ' ')
                : (timeZone || systemTimezone).split('/').pop()?.replace(/_/g, ' ')
            }`,
            value: timeZone || systemTimezone,
          },
        ]
      : options
  return {
    selectedHour,
    selectedMinute,
    selectedPeriod,
    setSelectedHour,
    setSelectedMinute,
    setSelectedPeriod,
    hours,
    minutes,
    inputValue,
    handleInputChange,
    isOpen,
    setIsOpen,
    handleCancel,
    handleSave,
    timeZonesOptions,
    handleBlur,
    timeFormat,
    is12HourFormat,
    selectedTimeZone,
    setSelectedTimeZone,
    isDisableSelect,
  }
}
