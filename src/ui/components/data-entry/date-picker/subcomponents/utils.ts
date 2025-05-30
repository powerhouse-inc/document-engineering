export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * Parses a BEM-style string with Tailwind classes into an object.
 * Example input: "block__element.text-red-500.p-4 block__modifier.bg-blue-100"
 * Example output: { "block__element": "text-red-500 p-4", "block__modifier": "bg-blue-100" }
 */
export function parseBemTailwindString(bemString?: string): Record<string, string> {
  const styles: Record<string, string> = {}
  if (!bemString || typeof bemString !== 'string') {
    return styles
  }

  const rules = bemString.trim().split(/\s+/) // Split by one or more spaces

  rules.forEach((rule) => {
    const firstDotIndex = rule.indexOf('.')
    if (firstDotIndex > 0 && firstDotIndex < rule.length - 1) {
      // Ensure dot exists and is not first/last char
      const bemSelector = rule.substring(0, firstDotIndex)
      const tailwindClasses = rule.substring(firstDotIndex + 1).replace(/\./g, ' ') // Replace further dots with spaces for Tailwind

      styles[bemSelector] = (styles[bemSelector] ? `${styles[bemSelector]} ` : '') + tailwindClasses
      styles[bemSelector] = styles[bemSelector].trim() // Clean up extra spaces
    }
  })

  return styles
}
