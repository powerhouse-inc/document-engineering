import { CountryCodePicker } from '../../../ui/components/data-entry/country-code-picker/index.js'
import { withFieldValidation } from '../fragments/with-field-validation/index.js'
import type { CountryCodeFieldProps } from './types.js'
import countries, { type Countries } from 'world-countries'

const CountryCodeField = withFieldValidation<CountryCodeFieldProps>(CountryCodePicker, {
  validations: {
    _validOption:
      ({ allowedCountries, excludedCountries, includeDependentAreas }) =>
      (value: string | undefined) => {
        if (value === '' || value === undefined) {
          return true
        }

        const validCountries = (countries as unknown as Countries)
          .filter((country) => (includeDependentAreas ? true : country.independent) && country.cca2 !== 'AQ')
          .map((country) => country.cca2)

        // First check if it's a valid country code
        if (!validCountries.includes(value)) {
          return 'Please select a valid country'
        }
        // Check if country is in allowed list
        if (Array.isArray(allowedCountries) && !allowedCountries.includes(value)) {
          return 'Please select a valid country'
        }
        // Check if country is in excluded list
        if (Array.isArray(excludedCountries) && excludedCountries.includes(value)) {
          return 'Please select a valid country'
        }

        return true
      },
  },
})

CountryCodeField.displayName = 'CountryCodeField'

export { CountryCodeField }
