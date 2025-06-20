import { describe, expect, it } from 'vitest'
import { transformInputTime } from './utils.js'

describe('transformInputTime', () => {
  describe('empty or null input', () => {
    it('should return empty values for empty input', () => {
      const result = transformInputTime('', true)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })

    it('should return empty values for input with only spaces', () => {
      const result = transformInputTime('   ', false)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })
  })

  describe('12-hour format', () => {
    it('should transform time in 12h format with AM', () => {
      const result = transformInputTime('09:30 AM', true)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })

    it('should transform time in 12h format with PM', () => {
      const result = transformInputTime('02:45 PM', true)
      expect(result).toEqual({ hour: '02', minute: '45', period: 'PM' })
    })

    it('should automatically convert 24h time to 12h if format is 12h', () => {
      const result = transformInputTime('14:30', true)
      expect(result).toEqual({ hour: '02', minute: '30', period: 'PM' })
    })

    it('should handle noon (12:00) as 12:00 PM', () => {
      const result = transformInputTime('12:00', true)
      expect(result).toEqual({ hour: '12', minute: '00', period: 'PM' })
    })

    it('should determine AM/PM based on original hour when not specified', () => {
      // Hour 8-11 should be AM
      const result1 = transformInputTime('09:00', true)
      expect(result1).toEqual({ hour: '09', minute: '00', period: 'AM' })

      // Hour 1-7 should be PM
      const result2 = transformInputTime('03:00', true)
      expect(result2).toEqual({ hour: '03', minute: '00', period: 'PM' })
    })

    it('should use periodToCheck when provided', () => {
      const result = transformInputTime('14:30', true, 1, 'AM')
      expect(result).toEqual({ hour: '02', minute: '30', period: 'AM' })
    })

    it('should handle input without minutes', () => {
      const result = transformInputTime('9', true)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })

    it('should handle 4-digit input', () => {
      const result = transformInputTime('1430', true)
      expect(result).toEqual({ hour: '02', minute: '30', period: 'PM' })
    })
  })

  describe('24-hour format', () => {
    it('should maintain time in 24h format', () => {
      const result = transformInputTime('14:30', false)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })

    it('should convert AM/PM to 24h format', () => {
      const result = transformInputTime('02:30 PM', false)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })

    it('should convert 12:00 AM to 00:00', () => {
      const result = transformInputTime('12:00 AM', false)
      expect(result).toEqual({ hour: '00', minute: '00', period: undefined })
    })

    it('should maintain 12:00 PM as 12:00', () => {
      const result = transformInputTime('12:00 PM', false)
      expect(result).toEqual({ hour: '12', minute: '00', period: undefined })
    })

    it('should handle input without minutes in 24h format', () => {
      const result = transformInputTime('14', false)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })
    it('should handle 4-digit input in 24h format', () => {
      const result = transformInputTime('1430', false)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })
  })

  describe('minute rounding', () => {
    it('should round minutes to specified interval', () => {
      const result = transformInputTime('09:32', true, 5)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })

    it('should round up when close to next interval', () => {
      const result = transformInputTime('09:33', true, 5)
      expect(result).toEqual({ hour: '09', minute: '35', period: 'AM' })
    })

    it('should round down when close to previous interval', () => {
      const result = transformInputTime('09:31', true, 5)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })

    it('should handle rounding at 60-minute limit', () => {
      const result = transformInputTime('09:58', true, 5)
      expect(result).toEqual({ hour: '09', minute: '55', period: 'AM' })
    })

    it('should use default interval of 1 minute', () => {
      const result = transformInputTime('09:30', true)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })
  })

  describe('edge cases and validation', () => {
    it('should handle invalid numeric values', () => {
      const result = transformInputTime('abcd', true)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })
    it('should handle invalid numeric values', () => {
      const result = transformInputTime('ab:cd', true)
      console.log('result', result)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })

    it('should handle only invalid minutes', () => {
      const result = transformInputTime('09:ab', true)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })

    it('should handle only invalid hours', () => {
      const result = transformInputTime('ab:30', true)
      expect(result).toEqual({ hour: '', minute: '', period: undefined })
    })

    it('should handle input with extra spaces', () => {
      const result = transformInputTime('  09:30  AM  ', true)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })

    it('should handle input with multiple spaces', () => {
      const result = transformInputTime('09:30   AM', true)
      expect(result).toEqual({ hour: '09', minute: '30', period: 'AM' })
    })

    // it('should handle input with lowercase AM/PM', () => {
    //   const result = transformInputTime('09:30 am', true)
    //   expect(result).toEqual({ hour: '09', minute: '30', period: 'am' })
    // })

    it('should convert 12h if had AM/PM', () => {
      const result = transformInputTime('02:30 PM', false)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })
  })

  describe('complex combinations', () => {
    it('should handle 24h to 12h conversion with rounding', () => {
      const result = transformInputTime('14:32', true, 5)
      expect(result).toEqual({ hour: '02', minute: '30', period: 'PM' })
    })

    it('should handle 12h to 24h conversion with rounding', () => {
      const result = transformInputTime('02:32 PM', false, 5)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })

    it('should handle 4-digit input with rounding', () => {
      const result = transformInputTime('1432', true, 5)
      expect(result).toEqual({ hour: '02', minute: '30', period: 'PM' })
    })

    it('should handle 4-digit input with rounding in 24h format', () => {
      const result = transformInputTime('1432', false, 5)
      expect(result).toEqual({ hour: '14', minute: '30', period: undefined })
    })
  })
})
