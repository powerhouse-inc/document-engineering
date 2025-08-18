import React, { useCallback, useEffect, useState } from 'react'
import { Select } from '../select/index.js'
import { CircleFlag } from 'react-circle-flags'
import countries, { type Countries } from 'world-countries'
import { SelectDiff } from '../select/select-diff.js'
import type { CountryCodePickerProps } from './types.js'

const renderCountryIcon = (showFlagIcons: boolean, countryCode: string) => {
  if (!showFlagIcons || !countryCode) return undefined
  return <CircleFlag className="size-4" countryCode={countryCode.toLowerCase()} height={16} />
}

const CountryCodePicker = React.forwardRef<HTMLButtonElement, CountryCodePickerProps>(
  (
    {
      label,
      required,
      value,
      defaultValue,
      onChange,
      placeholder,
      allowedCountries,
      excludedCountries,
      includeDependentAreas = false,
      optionFormat = 'NamesOnly',
      showFlagIcons = true,
      enableSearch,
      viewMode = 'edition',
      baseValue,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '')

    const defaultOptions = (countries as unknown as Countries)
      .filter(
        (country) => (includeDependentAreas ? true : country.independent) && country.cca2 !== 'AQ' // exclude Antarctica
      )
      .map((country) => ({
        value: country.cca2,
        label:
          optionFormat === 'CodesOnly'
            ? country.cca2
            : optionFormat === 'NamesAndCodes'
              ? `${country.name.common} (${country.cca2})`
              : country.name.common,
        icon: showFlagIcons
          ? () => <CircleFlag className="size-4" countryCode={country.cca2.toLowerCase()} height={16} />
          : undefined,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0))

    const allowedCountriesArray = Array.isArray(allowedCountries) ? allowedCountries : undefined
    const excludedCountriesArray = Array.isArray(excludedCountries) ? excludedCountries : undefined

    const options =
      allowedCountriesArray || excludedCountriesArray
        ? defaultOptions.filter((option) => {
            const isAllowedCountry = allowedCountriesArray ? allowedCountriesArray.includes(option.value) : true
            const isExcludedCountry = excludedCountriesArray ? !excludedCountriesArray.includes(option.value) : true
            return isAllowedCountry && isExcludedCountry
          })
        : defaultOptions

    const selectedOption = options.find((option) => option.value === internalValue)
    const baseOption = options.find((option) => option.value === baseValue)

    const selectedLabel = selectedOption?.label ?? internalValue
    const baseLabel = baseOption?.label ?? baseValue

    const baseIcon = baseOption ? renderCountryIcon(showFlagIcons, baseValue ?? '') : undefined
    const icon = selectedOption ? renderCountryIcon(showFlagIcons, internalValue) : undefined

    const handleChange = useCallback(
      (value: string | string[]) => {
        if (Array.isArray(value)) {
          console.warn('CountryCodePicker received array value, expected string')
          return
        }
        setInternalValue(value)
        onChange?.(value)
      },
      [onChange]
    )

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    if (viewMode === 'edition') {
      return (
        <Select
          ref={ref}
          options={options}
          selectionIcon="checkmark"
          selectionIconPosition="right"
          searchable={enableSearch}
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          label={label}
          required={required}
          {...props}
        />
      )
    }

    return (
      <SelectDiff
        value={selectedLabel}
        label={label}
        required={required}
        viewMode={viewMode}
        baseValue={baseLabel}
        baseIcon={baseIcon}
        icon={icon}
      />
    )
  }
)

CountryCodePicker.displayName = 'CountryCodePicker'

export { CountryCodePicker }
