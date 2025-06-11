import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CountryCodePicker } from './country-code-picker.js'

describe('CountryCodePicker Component', () => {
  const defaultProps = {
    name: 'country',
    label: 'Select Country',
  }

  it('should match snapshot', () => {
    const { asFragment } = render(<CountryCodePicker {...defaultProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(<CountryCodePicker {...defaultProps} />)
    expect(screen.getByText('Select Country')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<CountryCodePicker {...defaultProps} description="Please select your country" />)
    expect(screen.getByText('Please select your country')).toBeInTheDocument()
  })

  it('should show required indicator when required prop is true', () => {
    render(<CountryCodePicker {...defaultProps} required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should disable the field when disabled prop is true', () => {
    render(<CountryCodePicker {...defaultProps} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should display error messages', async () => {
    render(<CountryCodePicker {...defaultProps} errors={['Country is required']} />)
    await waitFor(() => {
      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(<CountryCodePicker {...defaultProps} warnings={['Some countries may not be available']} />)
    expect(screen.getByText('Some countries may not be available')).toBeInTheDocument()
  })

  it('should handle value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CountryCodePicker {...defaultProps} onChange={onChange} />)

    const select = screen.getByRole('combobox')
    await user.click(select)
    await user.click(screen.getByText('United States'))
    expect(onChange).toHaveBeenCalledWith('US')
  })

  it('should filter countries based on search when enableSearch is true', async () => {
    const user = userEvent.setup()
    render(<CountryCodePicker {...defaultProps} enableSearch placeholder="Search..." />)

    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search...'), 'united')

    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    expect(screen.queryByText('France')).not.toBeInTheDocument()
    expect(screen.queryByText('Germany')).not.toBeInTheDocument()
  })

  it('should filter countries based on allowedCountries prop', async () => {
    const user = userEvent.setup()
    render(<CountryCodePicker {...defaultProps} allowedCountries={['US', 'GB']} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    expect(screen.queryByText('France')).not.toBeInTheDocument()
  })

  it('should filter out countries based on excludedCountries prop', async () => {
    const user = userEvent.setup()
    render(<CountryCodePicker {...defaultProps} excludedCountries={['FR', 'DE']} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    expect(screen.queryByText('France')).not.toBeInTheDocument()
    expect(screen.queryByText('Germany')).not.toBeInTheDocument()
  })

  it('should handle both allowedCountries and excludedCountries props', async () => {
    const user = userEvent.setup()
    render(<CountryCodePicker {...defaultProps} allowedCountries={['US', 'GB', 'FR']} excludedCountries={['FR']} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    expect(screen.queryByText('France')).not.toBeInTheDocument()
  })

  it('should include dependent areas when includeDependentAreas is true', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<CountryCodePicker {...defaultProps} includeDependentAreas onChange={onChange} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('Puerto Rico')).toBeInTheDocument() // US territory
    expect(screen.getByText('Guam')).toBeInTheDocument() // US territory

    await user.click(screen.getByText('Puerto Rico'))
    expect(onChange).toHaveBeenCalledWith('PR')

    expect(screen.getByText('Puerto Rico')).toBeInTheDocument()
  })

  // Tests for viewMode and diffs functionality
  describe('viewMode and diffs', () => {
    it('should render in edition mode by default', () => {
      render(<CountryCodePicker {...defaultProps} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render in edition mode when viewMode is explicitly set to edition', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="edition" />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="US" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="removal" baseValue="United Kingdom" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="mixed" value="FR" baseValue="United States" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('France')).toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    it('should pass correct props to CountryCodePickerDiff component', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="mixed" value="US" baseValue="United Kingdom" required />)

      // Verify label is rendered
      expect(screen.getByText('Select Country')).toBeInTheDocument()

      // Verify required indicator
      expect(screen.getByText('*')).toBeInTheDocument()

      // Verify the diff component is rendered (not the select)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    })

    it('should handle empty value in diff mode', () => {
      const { container } = render(<CountryCodePicker {...defaultProps} viewMode="addition" value="" />)

      // Verify that diff component is rendered instead of select
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('Select Country')).toBeInTheDocument()

      // Find all span elements and verify they are empty
      const diffSpans = container.querySelectorAll('span')
      diffSpans.forEach((span) => {
        expect(span).toHaveTextContent('')
      })
    })

    it('should handle invalid country code in diff mode', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="INVALID" />)

      // Should fallback to showing the raw value when no matching option is found
      expect(screen.getByText('INVALID')).toBeInTheDocument()
    })

    it('should respect optionFormat in diff mode', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="US" optionFormat="NamesAndCodes" />)

      // Should show "United States (US)" format
      expect(screen.getByText('United States (US)')).toBeInTheDocument()
    })

    it('should respect optionFormat CodesOnly in diff mode', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="US" optionFormat="CodesOnly" />)

      // Should show just "US"
      expect(screen.getByText('US')).toBeInTheDocument()
    })

    it('should work with filtered countries in diff mode', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="US" allowedCountries={['US', 'GB']} />)

      // Should show the correct country name even when filtered
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    it('should handle dependent areas in diff mode', () => {
      render(<CountryCodePicker {...defaultProps} viewMode="addition" value="PR" includeDependentAreas />)

      // Should show Puerto Rico
      expect(screen.getByText('Puerto Rico')).toBeInTheDocument()
    })

    it('should maintain all existing functionality in edition mode with new props present', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <CountryCodePicker
          {...defaultProps}
          viewMode="edition"
          baseValue="US"
          enableSearch
          allowedCountries={['US', 'GB']}
          onChange={onChange}
        />
      )

      // Should still work as a normal select
      const select = screen.getByRole('combobox')
      await user.click(select)
      await user.click(screen.getByText('United States'))
      expect(onChange).toHaveBeenCalledWith('US')
    })
  })
})
