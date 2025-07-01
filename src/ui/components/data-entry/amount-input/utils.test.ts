import { describe, expect, it } from 'vitest'
import { displayValueAmount } from './utils.js'

describe('displayValueAmount', () => {
  it('should return undefined when value is undefined', () => {
    expect(displayValueAmount({ value: undefined })).toBeUndefined()
  })

  it('should return undefined when value is an empty string (as per current function logic for empty string)', () => {
    expect(displayValueAmount({ value: '' })).toBeUndefined()
  })

  it('should return the original value string if it is not a valid number', () => {
    expect(displayValueAmount({ value: 'abc' })).toBe('abc')
    expect(displayValueAmount({ value: '123a' })).toBe('123a')
    expect(displayValueAmount({ value: 'N/A' })).toBe('N/A')
    expect(displayValueAmount({ value: ' ' })).toBe(' ')
  })

  describe('when only viewPrecision is provided', () => {
    it('should format to viewPrecision with trailing zeros if trailingZeros is true', () => {
      expect(displayValueAmount({ value: '10.1234', viewPrecision: 2, trailingZeros: true })).toBe('10.12')
      expect(displayValueAmount({ value: '10', viewPrecision: 2, trailingZeros: true })).toBe('10.00')
      expect(displayValueAmount({ value: '10.5', viewPrecision: 3, trailingZeros: true })).toBe('10.500')
      expect(displayValueAmount({ value: '10.999', viewPrecision: 2, trailingZeros: true })).toBe('11.00')
    })

    it('should format to viewPrecision and remove trailing zeros if trailingZeros is false', () => {
      expect(displayValueAmount({ value: '10.1234', viewPrecision: 2, trailingZeros: false })).toBe('10.12')
      expect(displayValueAmount({ value: '10', viewPrecision: 2, trailingZeros: false })).toBe('10')
      expect(displayValueAmount({ value: '10.500', viewPrecision: 3, trailingZeros: false })).toBe('10.5')
      expect(displayValueAmount({ value: '10.999', viewPrecision: 2, trailingZeros: false })).toBe('11')
    })

    it('should handle zero viewPrecision correctly', () => {
      expect(displayValueAmount({ value: '10.5', viewPrecision: 0, trailingZeros: true })).toBe('11')
      expect(displayValueAmount({ value: '10.4', viewPrecision: 0, trailingZeros: false })).toBe('10')
      expect(displayValueAmount({ value: '0.9', viewPrecision: 0, trailingZeros: true })).toBe('1')
      expect(displayValueAmount({ value: '0.1', viewPrecision: 0, trailingZeros: false })).toBe('0')
    })
  })

  describe('when only precision is provided', () => {
    it('should truncate to precision with trailing zeros if trailingZeros is true', () => {
      expect(displayValueAmount({ value: '10.1234', precision: 2, trailingZeros: true })).toBe('10.12')
      expect(displayValueAmount({ value: '10', precision: 2, trailingZeros: true })).toBe('10.00')
      expect(displayValueAmount({ value: '10.5', precision: 3, trailingZeros: true })).toBe('10.500')
      expect(displayValueAmount({ value: '10.999', precision: 2, trailingZeros: true })).toBe('11.00')
    })

    it('should truncate to precision and remove trailing zeros if trailingZeros is false', () => {
      expect(displayValueAmount({ value: '10.1234', precision: 2, trailingZeros: false })).toBe('10.12')
      expect(displayValueAmount({ value: '10', precision: 2, trailingZeros: false })).toBe('10')
      expect(displayValueAmount({ value: '10.500', precision: 3, trailingZeros: false })).toBe('10.5')
      expect(displayValueAmount({ value: '10.999', precision: 2, trailingZeros: false })).toBe('11')
    })

    it('should handle zero precision correctly', () => {
      expect(displayValueAmount({ value: '10.5', precision: 0, trailingZeros: true })).toBe('11')
      expect(displayValueAmount({ value: '10.4', precision: 0, trailingZeros: false })).toBe('10')
    })
  })
})

it('should handle zero correctly', () => {
  expect(displayValueAmount({ value: '0', viewPrecision: 2, trailingZeros: true })).toBe('0.00')
  expect(displayValueAmount({ value: '0.000', viewPrecision: 2, trailingZeros: false })).toBe('0')
  expect(displayValueAmount({ value: '-0.005', viewPrecision: 2, trailingZeros: true })).toBe('-0.01') // Rounds to -0.01
  expect(displayValueAmount({ value: '-0.004', viewPrecision: 2, trailingZeros: true })).toBe('-0.00') // Rounds to -0.00
})

it('should handle very small numbers correctly (rounding up)', () => {
  expect(displayValueAmount({ value: '0.005', viewPrecision: 2, trailingZeros: true })).toBe('0.01')
})
