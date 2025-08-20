import { useMemo } from 'react'
import parsePhoneNumber from 'libphonenumber-js'
import { CircleFlag } from 'react-circle-flags'
import { cn } from '../../../../../scalars/lib/index.js'
import { type Change, diffSentences } from 'diff'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { SelectOption } from '../../select/types.js'
import type { PhoneNumberInputProps } from '../types.js'

interface PhoneNumberDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  options: SelectOption[]
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

const renderFlagIcon = (countryCode: string) => {
  return <CircleFlag className="size-4" countryCode={countryCode.toLowerCase()} height={16} />
}

const parsePhoneValue = (rawValue: string) => {
  if (rawValue === '') return { selectValue: '', inputValue: '' }

  const sanitizedValue = `+${rawValue.replace(/\D/g, '')}`
  const parsedValue = parsePhoneNumber(sanitizedValue, { extract: false })

  if (parsedValue?.isPossible() && parsedValue.country) {
    const expectedValue = `+${parsedValue.countryCallingCode}${parsedValue.nationalNumber}`
    if (sanitizedValue !== expectedValue) {
      return { selectValue: '', inputValue: rawValue.replace(/\D/g, '') }
    }

    const callingCode = `+${parsedValue.countryCallingCode}`
    const selectValue = `${callingCode}-${parsedValue.country}`
    const inputValue = parsedValue.nationalNumber
    return { selectValue, inputValue }
  }

  return { selectValue: '', inputValue: rawValue.replace(/\D/g, '') }
}

const PhoneNumberDiff = ({
  value,
  viewMode,
  baseValue,
  options = [],
  prefixOptionFormat = 'FlagsAndNumbers',
}: PhoneNumberDiffProps) => {
  // Parse phone numbers to get prefix and number parts
  const currentValueParsed = useMemo(() => parsePhoneValue(value), [value])
  const baseValueParsed = useMemo(() => parsePhoneValue(baseValue ?? ''), [baseValue])

  // Diff for the prefix (country code + calling code) - always using sentences
  const diffPrefix = useMemo(() => {
    const currentPrefix = currentValueParsed.selectValue
    const basePrefix = baseValueParsed.selectValue
    return diffSentences(basePrefix, currentPrefix)
  }, [currentValueParsed.selectValue, baseValueParsed.selectValue])

  // Diff for the phone number - always using sentences
  const diffNumber = useMemo(() => {
    const currentNumber = currentValueParsed.inputValue
    const baseNumber = baseValueParsed.inputValue
    return diffSentences(baseNumber, currentNumber)
  }, [currentValueParsed.inputValue, baseValueParsed.inputValue])

  // Render individual diff parts
  const renderDiffPart = (part: Change, index: number) => {
    const key = `${part.value}-${index}`

    // Handle added content
    if (part.added) {
      if (viewMode === 'addition' || viewMode === 'mixed') {
        return (
          <span key={key} className={cn('bg-green-600/30')}>
            {part.value}
          </span>
        )
      }
      return null
    }

    // Handle removed content
    if (part.removed) {
      if (viewMode === 'removal' || viewMode === 'mixed') {
        return (
          <span key={key} className={cn('bg-red-600/30')}>
            {part.value}
          </span>
        )
      }
      return null
    }

    // Handle unchanged content - always render this
    return <span key={key}>{part.value}</span>
  }

  // Render all diff parts for a specific diff
  const renderDiffContent = (diff: Change[]) => {
    return diff.map(renderDiffPart).filter(Boolean)
  }

  const prefixContent = renderDiffContent(diffPrefix)
  const numberContent = renderDiffContent(diffNumber)

  // Get the appropriate option for displaying flag and prefix
  const actualSelectValue = viewMode === 'addition' ? currentValueParsed.selectValue : baseValueParsed.selectValue
  const selectedOption = options.find((option) => option.value === actualSelectValue)

  // Helper function to get the appropriate diff styling
  const getDiffClassName = (diff: Change[]) => {
    // Check if there are any changes in the diff
    const hasAdditions = diff.some((part) => part.added)
    const hasRemovals = diff.some((part) => part.removed)

    if (hasAdditions && (viewMode === 'addition' || viewMode === 'mixed')) {
      return 'bg-green-600/30'
    }

    if (hasRemovals && (viewMode === 'removal' || viewMode === 'mixed')) {
      return 'bg-red-600/30'
    }

    return ''
  }

  const renderPrefixWithFlag = () => {
    if (!selectedOption) return prefixContent

    // Extract country code from selectValue (format: "+1-US")
    const countryCode = actualSelectValue.split('-')[1]
    const callingCode = actualSelectValue.split('-')[0] // This is the "+1" part

    // Use the same renderFlagIcon as in usePhoneNumberInput
    const flagIcon = countryCode ? renderFlagIcon(countryCode) : null

    // Determine what to show based on prefixOptionFormat (without extra spans)
    let displayContent = null
    switch (prefixOptionFormat) {
      case 'CodesOnly':
        // Show only the country code (e.g., "US")
        displayContent = countryCode
        break
      case 'FlagsOnly':
        displayContent = flagIcon ?? prefixContent
        break
      case 'FlagsAndCodes':
        // Show flag + country code (e.g., flag + "US")
        displayContent = (
          <>
            {flagIcon}
            {countryCode}
          </>
        )
        break
      case 'FlagsAndNumbers':
      default:
        // Show flag + calling code/prefix number (e.g., flag + "+1")
        displayContent = (
          <>
            {flagIcon}
            {callingCode}
          </>
        )
        break
    }

    return displayContent
  }

  return (
    <div className={cn('flex flex-1 w-full items-center gap-2')}>
      {/* Prefix section */}
      <div className="flex flex-row items-center justify-start shrink-0 leading-[18px]">
        <span className={cn('flex items-center gap-1', getDiffClassName(diffPrefix))}>{renderPrefixWithFlag()}</span>
      </div>
      {/* Number section */}
      <div className="flex flex-1 truncate [&>span]:w-full [&>span]:truncate leading-[18px]">{numberContent}</div>
    </div>
  )
}

PhoneNumberDiff.displayName = 'PhoneNumberDiff'

export { PhoneNumberDiff }
