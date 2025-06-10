import React from 'react'
import { Select } from '../select/index.js'
import { CircleFlag } from 'react-circle-flags'
import countries, { type Countries } from 'world-countries'
import type { CountryCodePickerProps } from './types.js'

const CountryCodePicker = React.forwardRef<HTMLButtonElement, CountryCodePickerProps>(
  (
    {
      onChange,
      placeholder,
      allowedCountries,
      excludedCountries,
      includeDependentAreas = false,
      viewMode = 'NamesOnly',
      showFlagIcons = true,
      enableSearch,
      ...props
    },
    ref
  ) => {
    const defaultOptions = (countries as unknown as Countries)
      .filter(
        (country) => (includeDependentAreas ? true : country.independent) && country.cca2 !== 'AQ' // exclude Antarctica
      )
      .map((country) => ({
        value: country.cca2,
        label:
          viewMode === 'CodesOnly'
            ? country.cca2
            : viewMode === 'NamesAndCodes'
              ? `${country.name.common} (${country.cca2})`
              : country.name.common,
        icon: showFlagIcons
          ? () => <CircleFlag className="size-4" countryCode={country.cca2.toLowerCase()} height={16} />
          : undefined,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0))

    const options =
      Array.isArray(allowedCountries) || Array.isArray(excludedCountries)
        ? defaultOptions.filter(
            (option) =>
              (!allowedCountries || allowedCountries.includes(option.value)) &&
              !excludedCountries?.includes(option.value)
          )
        : defaultOptions

    return (
      <Select
        ref={ref}
        options={options}
        selectionIcon="checkmark"
        selectionIconPosition="right"
        searchable={enableSearch}
        onChange={onChange as ((value: string | string[]) => void) | undefined}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

CountryCodePicker.displayName = 'CountryCodePicker'

export { CountryCodePicker }
