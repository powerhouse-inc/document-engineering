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

const validatePasswordSuggestions = (password: string): boolean => {
  if (password.length < 8) return false

  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false

  for (const char of specialCharacters) {
    if (password.includes(char)) {
      return true
    }
  }

  return false
}

export const adjustStrengthScore = (password: string, score: number | undefined): number | undefined => {
  if (score === 4 && password.length < 15 && !validatePasswordSuggestions(password)) {
    return 3
  }
  return score
}
