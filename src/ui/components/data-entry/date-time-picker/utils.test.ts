import { roundMinute } from '../time-picker/utils'
import { parseDateTimeValueToInput } from './utils'

describe('parseDateTimeValueToInput', () => {
  it('should return an empty string if no date or time value is provided', () => {
    const result = parseDateTimeValueToInput('', '', false, 1)
    expect(result).toBe('')
  })

  it('should correctly format the date and time in 24-hour format', () => {
    const result = parseDateTimeValueToInput('2024-03-10T14:45', 'yyyy-MM-dd', false, 1)
    expect(result).toBe('2024-03-10 14:45')
  })

  it('should correctly format the date and time in 12-hour format (AM - 09:00)', () => {
    const result = parseDateTimeValueToInput('2024-03-10T09:00', 'yyyy-MM-dd', true, 15)
    expect(result).toBe('2024-03-10 09:00 AM')
  })

  it('should correctly format the date and time in 12-hour format (PM - 17:30)', () => {
    const result = parseDateTimeValueToInput('2024-03-10T17:30', 'yyyy-MM-dd', true, 10)
    expect(result).toBe('2024-03-10 05:30 PM')
  })

  it('should handle minute rounding based on timeIntervals', () => {
    const result = parseDateTimeValueToInput('2024-01-01T10:07', 'yyyy-MM-dd', false, 5)
    expect(result).toBe('2024-01-01 10:05')
    expect(roundMinute(7, 5)).toBe(5)
  })

  it('should format 00:XX as 00:XX PM in 12-hour format (current logic)', () => {
    const result = parseDateTimeValueToInput('2024-03-10T00:05', 'yyyy-MM-dd', true, 1)
    expect(result).toBe('2024-03-10 00:05 PM')
  })

  it('should format 12:XX as 12:XX PM in 12-hour format', () => {
    const result = parseDateTimeValueToInput('2024-03-10T12:00', 'yyyy-MM-dd', true, 1)
    expect(result).toBe('2024-03-10 12:00 PM')
  })

  it('should format 23:XX as 11:XX PM in 12-hour format', () => {
    const result = parseDateTimeValueToInput('2024-03-10T23:59', 'yyyy-MM-dd', true, 1)

    expect(result).toBe('2024-03-10 11:59 PM')
  })
})
