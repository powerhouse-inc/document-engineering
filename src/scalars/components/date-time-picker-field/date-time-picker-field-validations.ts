import { format } from 'date-fns'
import type { DateFieldValue } from '../../../ui/components/data-entry/date-picker/types.js'
import {
  formatDateToValidCalendarDateFormat,
  getDateFromValue,
  splitIso8601DateTime,
} from '../../../ui/components/data-entry/date-picker/utils.js'
import {
  getDateFormat,
  isDateFormatAllowed,
  isValidTime,
  normalizeMonthFormat,
} from '../../../ui/components/data-entry/date-time-picker/utils.js'
import type { DateTimePickerFieldProps } from './types.js'

export const dateTimeFieldValidations =
  ({
    dateFormat = 'YYYY-MM-DD',
    minDate,
    maxDate,
    disablePastDates,
    disableFutureDates,
    timeIntervals,
  }: DateTimePickerFieldProps) =>
  (value: unknown) => {
    const valueString = value?.toString()

    if (value === '' || value === undefined) {
      return true
    }
    if (timeIntervals === 0) {
      return 'Please enter a valid timeIntervals'
    }
    if (!valueString?.toString().includes('T')) {
      return 'Invalid format. Use Date and Time separated by a space.'
    }
    const internalFormat = getDateFormat(dateFormat)
    // 1. Validate that it has date and time separated by space
    const { date, time } = splitIso8601DateTime(value as string)

    if (!date || !time) {
      return 'Invalid format. Use Date and Time separated by a space.'
    }

    const stringDate = normalizeMonthFormat(getDateFromValue(value as DateFieldValue))

    if (stringDate.length === 4 && internalFormat === 'yyyy-MM-dd') {
      return true
    }
    const isValidFormat = isDateFormatAllowed(stringDate, internalFormat)

    if (!isValidFormat) {
      return `Invalid date format. Use ${internalFormat.toUpperCase()}`
    }

    if (!isValidTime(time)) {
      return 'Invalid format. Use Date and Time separated by a space.'
    }
    const isoDate = formatDateToValidCalendarDateFormat(stringDate)
    const [datePart] = isoDate.split('T')
    const validDateStartOfDay = new Date(`${datePart}T00:00:00`)

    let effectiveMinDate: Date | null = null
    if (minDate) {
      const minDateValue = new Date(minDate)
      effectiveMinDate = new Date(minDateValue.setHours(0, 0, 0, 0))
    }
    if (disablePastDates) {
      const today = new Date()
      const todayStartOfDay = new Date(today.setHours(0, 0, 0, 0))
      if (!effectiveMinDate || todayStartOfDay > effectiveMinDate) {
        effectiveMinDate = todayStartOfDay
      }
    }

    // Get the most restrictive date between maxDate and disableFutureDates
    let effectiveMaxDate: Date | null = null
    if (maxDate) {
      const maxDateValue = new Date(maxDate)
      effectiveMaxDate = new Date(maxDateValue.setHours(0, 0, 0, 0))
    }
    if (disableFutureDates) {
      const today = new Date()
      const todayStartOfDay = new Date(today.setHours(0, 0, 0, 0))
      if (!effectiveMaxDate || todayStartOfDay < effectiveMaxDate) {
        effectiveMaxDate = todayStartOfDay
      }
    }

    // Validate against the effective dates
    if (effectiveMinDate && effectiveMaxDate) {
      if (effectiveMinDate > effectiveMaxDate) {
        const formattedMinDate = format(effectiveMinDate, internalFormat)
        const formattedMaxDate = format(effectiveMaxDate, internalFormat)
        return `Invalid date range: ${formattedMinDate} is after ${formattedMaxDate}`
      }

      if (validDateStartOfDay < effectiveMinDate || validDateStartOfDay > effectiveMaxDate) {
        const formattedMinDate = format(effectiveMinDate, internalFormat)
        const formattedMaxDate = format(effectiveMaxDate, internalFormat)
        return `Date should be between ${formattedMinDate.toUpperCase()} - ${formattedMaxDate.toUpperCase()}`
      }
    } else if (effectiveMinDate) {
      if (validDateStartOfDay < effectiveMinDate) {
        const formattedMinDate = format(effectiveMinDate, internalFormat)
        return `Date must be after ${formattedMinDate.toUpperCase()}`
      }
    } else if (effectiveMaxDate) {
      if (validDateStartOfDay > effectiveMaxDate) {
        const formattedMaxDate = format(effectiveMaxDate, internalFormat)
        return `Date must be before ${formattedMaxDate.toUpperCase()}`
      }
    }

    return true
  }
