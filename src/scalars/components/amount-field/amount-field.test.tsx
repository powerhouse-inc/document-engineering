import {
  commonCryptoCurrencies,
  commonFiatCurrencies,
} from '../../../ui/components/data-entry/currency-code-picker/defaults.js'
import { screen, waitFor } from '@testing-library/react'
import { renderWithForm } from '../../lib/testing.js'
import { AmountField } from './amount-field.js'
import userEvent from '@testing-library/user-event'

describe('AmountField Component', () => {
  it('should match snapshot', () => {
    const { container } = renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        units={commonCryptoCurrencies}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render label when provided', () => {
    renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        units={commonCryptoCurrencies}
      />
    )
    expect(screen.getByLabelText('Amount Label')).toBeInTheDocument()
  })

  it('should render error messages when provided', async () => {
    renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        errors={['Error 1', 'Error 2']}
        validators={() => 'Error 3'}
        units={commonCryptoCurrencies}
      />
    )
    await waitFor(() => {
      expect(screen.getByText('Error 1')).toBeInTheDocument()
      expect(screen.getByText('Error 2')).toBeInTheDocument()
      expect(screen.getByText('Error 3')).toBeInTheDocument()
    })
  })

  it('should render the percentage sign if the type is percent', () => {
    renderWithForm(<AmountField label="Amount Label" name="amount" type="AmountPercentage" value={345} step={0} />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should disable the input when disabled prop is true', () => {
    renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        units={commonCryptoCurrencies}
        disabled
      />
    )
    const input = screen.getByLabelText('Amount Label')

    expect(input).toBeDisabled()
  })

  it('should set the input as required when required prop is true', () => {
    renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        required
        units={commonCryptoCurrencies}
      />
    )
    expect(screen.getByRole('spinbutton')).toHaveAttribute('required')
  })

  it('should render the description when provided', () => {
    renderWithForm(
      <AmountField
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          value: 345,
        }}
        units={commonCryptoCurrencies}
        disabled
        description="This is a description"
      />
    )
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('should show validation error when currency is not selected', async () => {
    renderWithForm(
      <AmountField
        required
        label="Amount Label"
        name="amount"
        type="AmountFiat"
        showErrorOnBlur
        value={{
          value: 345,
          unit: '',
        }}
        units={commonFiatCurrencies}
        description="This is a description"
      />
    )

    const numberInput = screen.getByRole('spinbutton')
    await userEvent.click(numberInput)
    await userEvent.tab()
    expect(screen.getByText('Please select a valid currency')).toBeInTheDocument()
  })
})
