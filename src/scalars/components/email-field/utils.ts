const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

import type { ValidatorResult } from '../types.js'
export interface DomainValidationOptions {
  allowedDomains: string[]
}

export const validateEmailFormat = (value: string): ValidatorResult => {
  return emailRegex.test(value) || 'Please enter a valid email address'
}

export const extractEmailDomain = (email: string): string | null => {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain || null
}

export const isDomainAllowed = (domain: string, allowedDomains: string[]): boolean => {
  if (allowedDomains.length === 0) return true

  return allowedDomains.some((allowedDomain) => allowedDomain.toLowerCase() === domain.toLowerCase())
}

/**
 * Validates if an email domain is in the allowed domains list
 * @param value - The email string to validate
 * @param options - Validation options containing allowed domains
 * @returns true if valid, error message if invalid
 */

export const validateEmailDomain = (value: string, options: DomainValidationOptions): ValidatorResult => {
  if (options.allowedDomains.length === 0) return true

  const domain = extractEmailDomain(value)
  if (!domain) return 'Invalid email format'

  const isAllowed = isDomainAllowed(domain, options.allowedDomains)

  return isAllowed || `Email domain must be one of: ${options.allowedDomains.join(', ')}`
}
