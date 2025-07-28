export const specialCharacters = '" !#$%&\'()*+,-./:;<?>@=[\\]^_`{|}~'

export const strengthColors = [
  '[&_[data-slot=progress-bar-indicator]]:bg-red-900',
  '[&_[data-slot=progress-bar-indicator]]:bg-red-900',
  '[&_[data-slot=progress-bar-indicator]]:bg-red-900',
  '[&_[data-slot=progress-bar-indicator]]:bg-yellow-900',
  '[&_[data-slot=progress-bar-indicator]]:bg-green-900',
]
export const strengthLabels = ['Weak', 'Weak', 'Weak', 'Medium', 'Strong']
export const strengthValues = [33, 33, 33, 66, 100]

const validateMinLength = (password: string): boolean => {
  return password.length >= 8
}

const validateUppercase = (password: string): boolean => {
  return /[A-Z]/.test(password)
}

const validateLowercase = (password: string): boolean => {
  return /[a-z]/.test(password)
}

const validateNumber = (password: string): boolean => {
  return /[0-9]/.test(password)
}

const validateSpecialCharacter = (password: string): boolean => {
  for (const char of specialCharacters) {
    if (password.includes(char)) {
      return true
    }
  }
  return false
}

const validatePasswordSuggestions = (password: string): boolean => {
  return (
    validateMinLength(password) &&
    validateUppercase(password) &&
    validateLowercase(password) &&
    validateNumber(password) &&
    validateSpecialCharacter(password)
  )
}

export const adjustStrengthScore = (password: string, score: number | undefined): number | undefined => {
  if (score === 4 && password.length < 15 && !validatePasswordSuggestions(password)) {
    return 3
  }
  return score
}

export const getPasswordRequirements = (password: string) => {
  return [
    {
      text: 'Minimum 8 characters',
      isValid: validateMinLength(password),
    },
    {
      text: 'At least one uppercase letter',
      isValid: validateUppercase(password),
    },
    {
      text: 'At least one lowercase letter',
      isValid: validateLowercase(password),
    },
    {
      text: 'At least one number',
      isValid: validateNumber(password),
    },
    {
      text: `At least one special character: ${specialCharacters}`,
      isValid: validateSpecialCharacter(password),
    },
  ]
}
