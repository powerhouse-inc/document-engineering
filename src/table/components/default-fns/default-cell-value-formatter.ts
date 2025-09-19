const defaultValueFormatter = (value: unknown) => {
  if (value === null || value === undefined) {
    return ''
  }

  // Handle Amount objects by preserving them instead of converting to string
  if (typeof value === 'object' && 'value' in value) {
    return value
  }

  // For other values, convert to string
  return String(value)
}

export { defaultValueFormatter }
