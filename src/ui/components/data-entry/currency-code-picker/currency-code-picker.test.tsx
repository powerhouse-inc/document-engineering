import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyCodePicker } from './currency-code-picker.js'
import { currencies } from './utils.js'

describe('CurrencyCodePicker', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <CurrencyCodePicker
        name="currency"
        label="Currency"
        description="Select a currency"
        defaultValue="USD"
        currencies={currencies()}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render with default props', () => {
    render(<CurrencyCodePicker name="currency" label="Currency" currencies={currencies()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Currency')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<CurrencyCodePicker name="currency" label="Currency" disabled currencies={currencies()} />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should display custom errors', async () => {
    const errors = ['Please select a valid currency']
    render(<CurrencyCodePicker name="currency" label="Currency" errors={errors} currencies={currencies()} />)
    expect(await screen.findByText(errors[0])).toBeInTheDocument()
  })

  it('should display custom warnings', async () => {
    const warnings = ['This currency may have restrictions']
    render(<CurrencyCodePicker name="currency" label="Currency" warnings={warnings} currencies={currencies()} />)
    expect(await screen.findByText(warnings[0])).toBeInTheDocument()
  })

  it('should handle option selection', async () => {
    const onChangeMock = vi.fn()
    const user = userEvent.setup()

    render(<CurrencyCodePicker name="currency" label="Currency" currencies={currencies()} onChange={onChangeMock} />)

    // Open the dropdown
    await user.click(screen.getByRole('combobox'))

    // Select USD option
    await user.click(screen.getByText('USD ($)'))

    // Verify onChange was called with the correct value
    expect(onChangeMock).toHaveBeenCalledWith('USD')

    // Verify the selected option is displayed
    expect(screen.getByText('USD ($)')).toBeInTheDocument()
  })

  it('should not display currency symbols when includeCurrencySymbols is false', async () => {
    const user = userEvent.setup()

    render(
      <CurrencyCodePicker name="currency" label="Currency" currencies={currencies()} includeCurrencySymbols={false} />
    )

    // Open the dropdown
    await user.click(screen.getByRole('combobox'))

    // Verify USD option shows without symbol
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.queryByText('USD ($)')).not.toBeInTheDocument()

    // Verify EUR option shows without symbol
    expect(screen.getByText('EUR')).toBeInTheDocument()
    expect(screen.queryByText('EUR (€)')).not.toBeInTheDocument()
  })

  it('should display currency symbols on the left when symbolPosition is left', async () => {
    const user = userEvent.setup()

    render(<CurrencyCodePicker name="currency" label="Currency" currencies={currencies()} symbolPosition="left" />)

    // Open the dropdown
    await user.click(screen.getByRole('combobox'))

    // Verify USD option shows with symbol on the left
    expect(screen.getByText('($) USD')).toBeInTheDocument()
    expect(screen.queryByText('USD ($)')).not.toBeInTheDocument()

    // Verify EUR option shows with symbol on the left
    expect(screen.getByText('(€) EUR')).toBeInTheDocument()
    expect(screen.queryByText('EUR (€)')).not.toBeInTheDocument()
  })

  it('should display only crypto currencies when allowedTypes is Crypto', async () => {
    const user = userEvent.setup()

    render(<CurrencyCodePicker name="currency" label="Currency" allowedTypes="Crypto" />)

    // Open the dropdown
    await user.click(screen.getByRole('combobox'))

    // Verify crypto currencies are present
    expect(screen.getByText('DAI (DAI)')).toBeInTheDocument()
    expect(screen.getByText('ETH (ETH)')).toBeInTheDocument()
    expect(screen.getByText('MKR (MKR)')).toBeInTheDocument()
    expect(screen.getByText('SKY (SKY)')).toBeInTheDocument()
    expect(screen.getByText('USDC (USDC)')).toBeInTheDocument()
    expect(screen.getByText('USDS (USDS)')).toBeInTheDocument()

    // Verify fiat currencies are not present
    expect(screen.queryByText('USD ($)')).not.toBeInTheDocument()
    expect(screen.queryByText('EUR (€)')).not.toBeInTheDocument()
    expect(screen.queryByText('GBP (£)')).not.toBeInTheDocument()
  })

  // Tests for viewMode and diffs functionality
  describe('viewMode and diffs', () => {
    it('should render in edition mode by default', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render in edition mode when viewMode is explicitly set to edition', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" viewMode="edition" />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" viewMode="addition" value="USDC" baseValue="ETH" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('USDC (USDC)')).toBeInTheDocument()
      expect(screen.queryByText('ETH (ETH)')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" viewMode="removal" value="USDC" baseValue="ETH" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('ETH (ETH)')).toBeInTheDocument()
      expect(screen.queryByText('USDC (USDC)')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" viewMode="mixed" value="ETH" baseValue="USDC" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('ETH (ETH)')).toBeInTheDocument()
      expect(screen.getByText('USDC (USDC)')).toBeInTheDocument()
    })

    it('should pass correct props to CurrencyCodePickerDiff component', () => {
      render(
        <CurrencyCodePicker name="currency" label="Currency" viewMode="mixed" value="USDC" baseValue="ETH" required />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByText('USDC (USDC)')).toBeInTheDocument()
      expect(screen.getByText('ETH (ETH)')).toBeInTheDocument()
    })

    it('should handle empty value in diff mode', () => {
      const { container } = render(<CurrencyCodePicker name="currency" label="Currency" viewMode="addition" value="" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      const diffSpans = container.querySelectorAll('span')
      diffSpans.forEach((span) => {
        expect(span).toHaveTextContent('')
      })
    })

    it('should fallback to showing the raw value when no matching option is found', () => {
      render(<CurrencyCodePicker name="currency" label="Currency" viewMode="mixed" value="NEW" baseValue="OLD" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('NEW')).toBeInTheDocument()
      expect(screen.getByText('OLD')).toBeInTheDocument()
    })

    it('should respect includeCurrencySymbols in diff mode', () => {
      render(
        <CurrencyCodePicker
          name="currency"
          label="Currency"
          viewMode="addition"
          value="USD"
          includeCurrencySymbols={false}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      // Should show just "USD" without symbol
      expect(screen.getByText('USD')).toBeInTheDocument()
      expect(screen.queryByText('USD ($)')).not.toBeInTheDocument()
    })

    it('should respect symbolPosition in diff mode', () => {
      render(
        <CurrencyCodePicker name="currency" label="Currency" viewMode="addition" value="EUR" symbolPosition="left" />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      // Should show "($) EUR" format with symbol on the left
      expect(screen.getByText('(€) EUR')).toBeInTheDocument()
      expect(screen.queryByText('EUR (€)')).not.toBeInTheDocument()
    })

    it('should work with allowedTypes in diff mode', () => {
      render(
        <CurrencyCodePicker name="currency" label="Currency" viewMode="addition" value="ETH" allowedTypes="Crypto" />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('ETH (ETH)')).toBeInTheDocument()
      expect(screen.queryByText('USD ($)')).not.toBeInTheDocument()
    })

    it('should handle favoriteCurrencies in diff mode', () => {
      render(
        <CurrencyCodePicker
          name="currency"
          label="Currency"
          viewMode="addition"
          value="USD"
          favoriteCurrencies={['USD']}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('USD ($)')).toBeInTheDocument()
    })
  })
})
