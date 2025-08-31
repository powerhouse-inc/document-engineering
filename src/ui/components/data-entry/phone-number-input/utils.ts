import parsePhoneNumber, {
  type CountryCode,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
} from 'libphonenumber-js'

export const getCallingCode = (countryCode: string): string | null => {
  try {
    const callingCode = getCountryCallingCode(countryCode as CountryCode)
    return `+${callingCode}`
  } catch {
    return null
  }
}

export const parsePhoneValue = (rawValue: string) => {
  if (rawValue === '') return null

  const withPlusValue = `${rawValue.startsWith('+') ? '' : '+'}${rawValue}`
  const parsedValue = parsePhoneNumber(withPlusValue, { extract: false })

  if (parsedValue?.isPossible() && parsedValue.country) {
    const expectedValue = `+${parsedValue.countryCallingCode}${parsedValue.nationalNumber}`
    if (withPlusValue !== expectedValue) {
      return null // the number was corrected by the library, reject it
    }

    const callingCode = `+${parsedValue.countryCallingCode}`
    const selectValue = `${callingCode}-${parsedValue.country}`
    const inputValue = parsedValue.nationalNumber
    return { selectValue, inputValue }
  }

  return null
}

export const formatPhoneNumber = (callingCode: string, inputValue: string): string => {
  if (callingCode === '' || inputValue === '') {
    return ''
  }

  const phoneNumber = `${callingCode}${inputValue}`
  const formatted = formatIncompletePhoneNumber(phoneNumber)

  if (formatted !== '' && formatted.length > callingCode.length) {
    const nationalPart = formatted.substring(callingCode.length).trim()
    return nationalPart || inputValue
  }

  return inputValue
}

export const removePhoneNumberFormat = (formattedValue: string): string => {
  return formattedValue.replace(/\D/g, '')
}

export const countDigitsBeforeCursor = (formattedText: string, cursorPos: number): number => {
  let digitCount = 0
  for (let i = 0; i < cursorPos && i < formattedText.length; i++) {
    if (/\d/.test(formattedText[i])) {
      digitCount++
    }
  }
  return digitCount
}

export const mapCursorPositionToFormattedText = (
  unformattedValue: string,
  formattedValue: string,
  targetDigitPosition: number
): number => {
  if (targetDigitPosition === 0) {
    return 0
  }

  // cursor at or beyond the end of unformatted value
  if (targetDigitPosition >= unformattedValue.length) {
    return formattedValue.length
  }

  // find the position in formatted value that corresponds to the target digit position
  let digitCount = 0
  for (let i = 0; i < formattedValue.length; i++) {
    if (/\d/.test(formattedValue[i])) {
      digitCount++
      if (digitCount === targetDigitPosition) {
        return i + 1
      }
    }
  }

  return formattedValue.length
}
