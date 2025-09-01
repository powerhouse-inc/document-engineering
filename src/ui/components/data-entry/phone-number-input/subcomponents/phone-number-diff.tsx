import { useMemo } from 'react'
import parsePhoneNumber from 'libphonenumber-js'
import { CircleFlag } from 'react-circle-flags'
import { cn } from '../../../../../scalars/lib/index.js'
import { type Change, diffSentences } from 'diff'
import { formatPhoneNumber } from '../utils.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import type { SelectOption } from '../../select/types.js'
import type { PhoneNumberInputProps } from '../types.js'

interface PhoneNumberDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  selectValue: string
  inputValue: string
  options: SelectOption[]
  prefixOptionFormat: PhoneNumberInputProps['prefixOptionFormat']
}

const renderFlagIcon = (countryCode: string) => {
  return <CircleFlag className="size-4" countryCode={countryCode.toLowerCase()} height={16} />
}

const parsePhoneValue = (rawValue: string, options: SelectOption[] = []) => {
  if (rawValue === '') return { selectValue: '', inputValue: '' }

  let inputValueToProcess = rawValue.replace(/\D/g, '')
  const sanitizedValue = inputValueToProcess
  if (inputValueToProcess.startsWith('00')) {
    inputValueToProcess = inputValueToProcess.substring(2)
  }

  const withPlusValue = `+${inputValueToProcess}`
  const parsedValue = parsePhoneNumber(withPlusValue, { extract: false })

  if (parsedValue?.isPossible() && parsedValue.country) {
    const expectedValue = `+${parsedValue.countryCallingCode}${parsedValue.nationalNumber}`
    if (withPlusValue !== expectedValue) {
      return { selectValue: '', inputValue: sanitizedValue }
    }

    const callingCode = `+${parsedValue.countryCallingCode}`
    const selectValue = `${callingCode}-${parsedValue.country}`

    if (!options.some((o) => o.value === selectValue)) {
      return { selectValue: '', inputValue: sanitizedValue }
    }

    const inputValue = parsedValue.nationalNumber
    return { selectValue, inputValue }
  }

  return { selectValue: '', inputValue: sanitizedValue }
}

const PhoneNumberDiff = ({
  selectValue,
  inputValue,
  viewMode,
  baseValue,
  options = [],
  prefixOptionFormat = 'FlagsAndNumbers',
}: PhoneNumberDiffProps) => {
  // Parse baseValue to get prefix and number parts
  const baseValueParsed = useMemo(() => parsePhoneValue(baseValue ?? '', options), [baseValue, options])

  const diffPrefix = useMemo(() => {
    const basePrefix = baseValueParsed.selectValue
    return diffSentences(basePrefix, selectValue)
  }, [selectValue, baseValueParsed.selectValue])

  const diffNumber = useMemo(() => {
    let formattedBaseInputValue = baseValueParsed.inputValue
    if (baseValueParsed.selectValue !== '' && baseValueParsed.inputValue !== '') {
      const baseCallingCode = baseValueParsed.selectValue.split('-')[0]
      formattedBaseInputValue = formatPhoneNumber(baseCallingCode, baseValueParsed.inputValue)
    }

    return diffSentences(formattedBaseInputValue, inputValue)
  }, [inputValue, baseValueParsed])

  // Render individual diff parts
  const renderDiffPart = (part: Change, index: number) => {
    const key = `${part.value}-${index}`

    // Handle added content
    if (part.added) {
      if (viewMode === 'addition') {
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
      if (viewMode === 'removal') {
        return (
          <span key={key} className={cn('bg-red-600/30')}>
            {part.value}
          </span>
        )
      }
      return null
    }

    // Handle unchanged content
    return <span key={key}>{part.value}</span>
  }

  // Render all diff parts for a specific diff
  const renderDiffContent = (diff: Change[]) => {
    return diff.map(renderDiffPart).filter(Boolean)
  }

  const numberContent = renderDiffContent(diffNumber)

  // Get the appropriate option for displaying flag and prefix
  const actualSelectValue = viewMode === 'addition' ? selectValue : baseValueParsed.selectValue
  const selectedOption = options.find((option) => option.value === actualSelectValue)

  // Get the appropriate diff styling
  const getDiffClassName = (diff: Change[]) => {
    const hasAdditions = diff.some((part) => part.added)
    const hasRemovals = diff.some((part) => part.removed)

    if (hasAdditions && viewMode === 'addition') {
      return 'bg-green-600/30'
    }

    if (hasRemovals && viewMode === 'removal') {
      return 'bg-red-600/30'
    }

    return ''
  }

  const renderPrefixWithFlag = () => {
    if (!selectedOption) return null

    // Extract country code from selectValue
    const countryCode = actualSelectValue.split('-')[1]
    const callingCode = actualSelectValue.split('-')[0]

    const flagIcon = countryCode !== '' ? renderFlagIcon(countryCode) : null

    // Determine what to show based on prefixOptionFormat
    let displayContent = null
    switch (prefixOptionFormat) {
      case 'CodesOnly':
        displayContent = countryCode
        break
      case 'FlagsOnly':
        displayContent = flagIcon
        break
      case 'FlagsAndCodes':
        displayContent = (
          <>
            {flagIcon}
            {countryCode}
          </>
        )
        break
      case 'FlagsAndNumbers':
      default:
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

  const prefixWithFlag = renderPrefixWithFlag()

  return (
    <div className={cn('flex flex-1 w-full items-center', prefixWithFlag !== null && 'gap-2')}>
      {/* Prefix section */}
      <div className="flex flex-row items-center justify-start shrink-0 leading-[18px]">
        <span className={cn('flex items-center gap-1', getDiffClassName(diffPrefix))}>{prefixWithFlag}</span>
      </div>
      {/* Number section */}
      <div className="flex flex-1 truncate [&>span]:w-full [&>span]:truncate leading-[18px]">{numberContent}</div>
    </div>
  )
}

PhoneNumberDiff.displayName = 'PhoneNumberDiff'

export { PhoneNumberDiff }
