import { format, isValid, parse } from 'date-fns'
import { getDateFromValue, getTimeFromValue } from '../date-picker/utils.js'
import type { DateFieldValue } from '../date-picker/types.js'
import { getInputValue, roundMinute } from '../time-picker/utils.js'
import type { TimeFieldValue } from '../time-picker/type.js'

export const ALLOWED_FORMATS = [
  'yyyy-MM-dd',
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'dd-MMM-yyyy',
  'MMM-dd-yyyy',
  'yyyy-MM',
  'MM/yyyy',
  'MMM-yyyy',
  'yyyy',
]

export const isFormatAllowed = (dateString: string) =>
  Object.values(dateFormatRegexes).some((regex) => regex.test(dateString))

export const isDateFormatAllowed = (dateString: string, dateFormat?: string) => {
  if (!dateFormat) return isFormatAllowed(dateString)
  const regex = dateFormatRegexes[dateFormat as keyof typeof dateFormatRegexes]
  return regex.test(dateString)
}

export const dateFormatRegexes = {
  'yyyy-MM-dd': /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  'dd/MM/yyyy': /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  'MM/dd/yyyy': /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
  'dd-MMM-yyyy': /^(0[1-9]|[12]\d|3[01])-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/,
  'MMM-dd-yyyy': /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(0[1-9]|[12]\d|3[01])-\d{4}$/,
  'yyyy-MM': /^\d{4}-(0[1-9]|1[0-2])$/,
  'MM/yyyy': /^(0[1-9]|1[0-2])\/\d{4}$/,
  'MMM-yyyy': /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/,
  yyyy: /^\d{4}$/,
}

/**
 * Split a date-time string into date and time components
 * @param dateTimeString - The date-time string to split
 * @returns An object containing the date and time components
 * @example
 * splitDateTimeStringFromInput("2024-01-01 12:00:00") // { date: "2024-01-01", time: "12:00:00" }
 */
export const splitDateTimeStringFromInput = (dateTimeString: string): { date: string; time: string } => {
  if (!dateTimeString.includes(' ')) {
    return { date: '', time: '' }
  }

  const [date = '', time = ''] = dateTimeString.split(' ')
  return { date, time }
}

/**
 * Check if a time string is valid
 * @param time - The time string to check
 * @returns True if the time string is valid, false otherwise
 * @example
 * isValidTime("12:00:00") // true
 */
export const isValidTime = (time: string) => {
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/
  const trimmedTime = time.split(':').slice(0, 2).join(':')
  return timeRegex.test(trimmedTime)
}

/**
 * Get the local system timezone offset in ±HH:MM format
 * @returns The local timezone offset (e.g., "+02:00", "-05:00")
 * @example
 * getLocalOffset() // Returns "+01:00" for GMT+1
 * getLocalOffset() // Returns "-05:00" for GMT-5
 */
export const getLocalOffset = (): string => {
  const localOffset = new Date().getTimezoneOffset()
  const sign = localOffset <= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(localOffset) / 60)).padStart(2, '0')
  const minutes = String(Math.abs(localOffset) % 60).padStart(2, '0')
  return `${sign}${hours}:${minutes}`
}

/**
 * Gets the current UTC offset for a specific time zone
 * @param timeZone - The IANA time zone name (e.g. "America/New_York", "Europe/London").
 *                   If not provided or invalid, falls back to local system timezone.
 * @returns The offset in ISO 8601 format (±HH:mm) based on current DST rules.
 * @example
 * getOffset("America/New_York") // Returns "-04:00" (EDT) or "-05:00" (EST)
 * getOffset("Asia/Kolkata")     // Returns "+05:30" (IST - no DST)
 * getOffset("Invalid/Zone")     // Returns local system offset (e.g. "-03:00")
 * getOffset()                   // Returns local system offset
 */
export const getOffset = (timeZone?: string) => {
  // Handle edge cases first
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      timeZoneName: 'shortOffset',
    })
    // Extract the offset from the format
    const offsetPart = formatter.formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value

    if (!offsetPart) return getLocalOffset()
    const offsetMatch =
      /^(?:GMT|UTC)?([+-])(\d{1,2})(?::?(\d{2}))?/i.exec(offsetPart) ?? /(UTC|GMT)([+-]\d{2}:\d{2})/.exec(offsetPart)

    if (!offsetMatch) return getLocalOffset()
    const sign = offsetMatch[1] || '+'
    const hours = (offsetMatch[2] || '00').padStart(2, '0')
    const minutes = (offsetMatch[3] || '00').padStart(2, '0')

    return `${sign}${hours}:${minutes}`
  } catch {
    return getLocalOffset()
  }
}

/**
 * Parse an input string to a valid date format
 * @param inputString - The input string to parse
 * @param dateFormat - The date format to use
 * @returns The parsed date string
 * @example
 * parseInputString("2024-01-01 12:00:00", "yyyy-MM-dd HH:mm:ss") // "2024-01-01 12:00:00"
 */
export const parseInputString = (inputString: string, dateFormat = ALLOWED_FORMATS[0]): string => {
  const newInputString = normalizeMonthFormat(inputString)

  if (!inputString) return inputString

  // First check the specified format
  if (dateFormat in dateFormatRegexes) {
    const specifiedFormatRegex = dateFormatRegexes[dateFormat as keyof typeof dateFormatRegexes]
    if (specifiedFormatRegex.test(newInputString)) {
      const parsedDate = parse(newInputString, dateFormat, new Date())
      if (isValid(parsedDate)) {
        return format(parsedDate, dateFormat)
      }
    }
  }

  for (const [formatStr, regex] of Object.entries(dateFormatRegexes)) {
    if (regex.test(newInputString)) {
      const parsedDate = parse(newInputString, formatStr, new Date())
      if (isValid(parsedDate)) {
        const newValue = format(parsedDate, dateFormat || formatStr)
        return newValue
      }
    }
  }
  return inputString
}

// Create a blurEvent
export const createBlurEvent = (value: string): React.FocusEvent<HTMLInputElement> => {
  const nativeEvent = new Event('blur', { bubbles: true, cancelable: true })
  Object.defineProperty(nativeEvent, 'target', {
    value: { value },
    writable: false,
  })
  return nativeEvent as unknown as React.FocusEvent<HTMLInputElement>
}

export const FORMAT_MAPPING = {
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD-MMM-YYYY': 'dd-MMM-yyyy',
  'MMM-DD-YYYY': 'MMM-dd-yyyy',
  'YYYY-MM': 'yyyy-MM',
  'MM/YYYY': 'MM/yyyy',
  'MMM-YYYY': 'MMM-yyyy',
  YYYY: 'yyyy',
}
export const FORMAT_MAPPING_DATE_TIME_PICKER = {
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD-MMM-YYYY': 'dd-MMM-yyyy',
  'MMM-DD-YYYY': 'MMM-dd-yyyy',
}

export const getDateFormat = (displayFormat: string): string => {
  switch (displayFormat) {
    case 'YYYY-MM-DD':
      return 'yyyy-MM-dd'
    case 'DD/MM/YYYY':
      return 'dd/MM/yyyy'
    case 'MM/DD/YYYY':
      return 'MM/dd/yyyy'
    case 'DD-MMM-YYYY':
      return 'dd-MMM-yyyy'
    case 'MMM-DD-YYYY':
      return 'MMM-dd-yyyy'
    case 'YYYY-MM':
      return 'yyyy-MM'
    case 'MM/YYYY':
      return 'MM/yyyy'
    case 'MMM-YYYY':
      return 'MMM-yyyy'
    case 'YYYY':
      return 'yyyy'
    default:
      return 'yyyy-MM-dd'
  }
}

export const normalizeMonthFormat = (dateString: string): string => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  return dateString.replace(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i, (month) => {
    const upperMonth = month.toUpperCase()
    const monthIndex = months.indexOf(upperMonth)
    if (monthIndex !== -1) {
      return months[monthIndex].charAt(0) + months[monthIndex].slice(1).toLowerCase()
    }
    return month
  })
}

export const parseDateValue = (dateValue: string | number | undefined) => {
  if (dateValue === undefined) return undefined

  // if timestamp from storybook
  if (typeof dateValue === 'number') {
    const date = new Date(dateValue)
    date.setUTCHours(12, 0, 0, 0) // Use UTC noon
    return date
  }

  // try to parse the date using the different formats
  for (const format of Object.values(FORMAT_MAPPING)) {
    try {
      const parsedDate = parse(dateValue, format, new Date())
      if (isValid(parsedDate)) {
        // Create the date in UTC
        const utcDate = new Date(
          Date.UTC(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            12, // Set to noon UTC
            0,
            0
          )
        )
        return utcDate
      }
    } catch {
      continue
    }
  }

  return undefined
}

/**
 * Determine the type of calendar to open based on the date format.
 * @param dateFormat - The date format.
 * @returns The type of calendar to open.
 * @example
 * getCalendarType('YYYY') // 'year'
 * getCalendarType('YYYY-MM') // 'month'
 * getCalendarType('YYYY-MM-DD') // 'day'
 */

export const getCalendarType = (dateFormat: string): 'years' | 'months' | 'days' => {
  if (!dateFormat) return 'days'
  const isDayFormat = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD-MMM-YYYY', 'MMM-DD-YYYY'].includes(dateFormat)
  if (isDayFormat) return 'days'
  return 'years'
}

export const formatToISODateTimeWithOffset = (datePart: string, timePart: string, timeZone?: string): string => {
  const formattedTime = timePart ? `${timePart}:00` : '00:00:00'
  const formattedDateTime = `${datePart}T${formattedTime}${getOffset(timeZone)}`
  const formattedTimeWithMiliseconds = formattedDateTime.replace(/(:\d{2})([+-].*|Z)/, '$1.000$2') || ''
  return formattedTimeWithMiliseconds
}

export const todayInIsoFormat = () => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX")
}

export const todayTimeInput = () => {
  return format(new Date(), 'HH:mm:ss')
}
export const todayDateInput = (dateFormat?: string) => {
  return format(new Date(), dateFormat ?? 'yyyy-MM-dd')
}

export const parseDateTimeValueToInput = (
  value: DateFieldValue,
  dateFormat = 'yyyy-MM-dd',
  is12HourFormat: boolean,
  timeIntervals: number
) => {
  if (value && !value.toString().includes('T')) return value.toString()
  const datePart = getDateFromValue(value)
  const dateFormatted = parseInputString(datePart, dateFormat)

  const timePart = getTimeFromValue(value)

  const timeFormatted = getInputValue(timePart)
  let date = dateFormatted
  let time = timeFormatted

  if (!dateFormatted && !timeFormatted) {
    return ''
  }

  const dateDefault = todayDateInput()
  const timeDefault = todayTimeInput()

  if (!dateFormatted) {
    date = dateDefault
  }

  if (!timeFormatted) {
    time = timeDefault
  }
  const hours = Number(time.split(':')[0])
  const minutesWithInterval = String(roundMinute(Number(time.split(':')[1]), timeIntervals)).padStart(2, '0')

  const period = is12HourFormat ? (hours >= 8 && hours <= 11 ? 'AM' : 'PM') : undefined
  const hoursToShow12HoursFormat = String(hours > 12 ? hours - 12 : hours).padStart(2, '0')
  const hoursToShow24HoursFormat = String(hours).padStart(2, '0')
  const formattedDateTime = is12HourFormat
    ? `${date} ${hoursToShow12HoursFormat}:${minutesWithInterval} ${period}`
    : `${date} ${hoursToShow24HoursFormat}:${minutesWithInterval}`

  return formattedDateTime
}

export const putTimeInValue = (value: DateFieldValue, time: TimeFieldValue) => {
  let datePart = getDateFromValue(value)
  if (!datePart) {
    const today = todayInIsoFormat()
    datePart = getDateFromValue(today)
  }
  return `${datePart}T${time}`
}

export const putDateInValue = (value: DateFieldValue, date: DateFieldValue) => {
  let timePart = getTimeFromValue(value)

  if (!timePart) {
    const today = todayInIsoFormat()
    timePart = getTimeFromValue(today)
  }

  const datePart = getDateFromValue(date)
  const newValue = `${datePart}T${timePart}`
  const formattedTime = newValue.replace(/(:\d{2})([+-].*|Z)/, '$1.000$2') || ''
  return formattedTime
}
