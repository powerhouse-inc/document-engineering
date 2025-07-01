import { render, screen } from '@testing-library/react'
import { AmountInput } from './amount-input.js'
import { commonCryptoCurrencies } from '../currency-code-picker/defaults.js'

describe('AmountField Component', () => {
  const onChange = vi.fn()
  it('should match snapshot', () => {
    const { container } = render(
      <AmountInput
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          amount: 345,
        }}
        units={commonCryptoCurrencies}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render label when provided', () => {
    render(
      <AmountInput
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          amount: 345,
        }}
        units={commonCryptoCurrencies}
      />
    )
    expect(screen.getByLabelText('Amount Label')).toBeInTheDocument()
  })

  it('should render the percentage sign if the type is percent', () => {
    render(<AmountInput label="Amount Label" name="amount" type="AmountPercentage" value={345} step={0} />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should disable the input when disabled prop is true', () => {
    render(
      <AmountInput
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          amount: 345,
        }}
        units={commonCryptoCurrencies}
        disabled
      />
    )
    const input = screen.getByLabelText('Amount Label')

    expect(input).toBeDisabled()
  })

  it('should set the input as required when required prop is true', () => {
    render(
      <AmountInput
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          amount: 345,
        }}
        required
        units={commonCryptoCurrencies}
      />
    )
    expect(screen.getByRole('spinbutton')).toHaveAttribute('required')
  })

  it('should render the description when provided', () => {
    render(
      <AmountInput
        label="Amount Label"
        name="amount"
        type="Amount"
        value={{
          amount: 345,
        }}
        units={commonCryptoCurrencies}
        disabled
        description="This is a description"
      />
    )
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  describe('AmountInputDiff differences', () => {
    it('should render AmountInputDiff when viewMode is addition', () => {
      render(
        <AmountInput
          type="Amount"
          name="amount"
          viewMode="addition"
          onChange={onChange}
          value={{
            amount: 345,
          }}
          baseValue={{
            amount: 1345,
          }}
        />
      )
      expect(screen.getByTestId('amount-input-diff')).toBeInTheDocument()
      expect(screen.getByText('345')).toBeInTheDocument()
      expect(screen.queryByText('1345')).not.toBeInTheDocument()
    })

    it('should render DateInputDiff when viewMode is removal', () => {
      render(
        <AmountInput
          name="amount"
          type="AmountCurrency"
          viewMode="removal"
          value={{
            amount: '9345',
            unit: 'USD',
          }}
          baseValue={{
            amount: 2345,
            unit: 'USD',
          }}
        />
      )
      expect(screen.getByTestId('amount-input-diff')).toBeInTheDocument()
      expect(screen.getByText('2345')).toBeInTheDocument()
      expect(screen.queryByText('9345')).not.toBeInTheDocument()
    })

    it('should render DateInputDiff when viewMode is mixed', () => {
      render(
        <AmountInput
          name="amount"
          type="AmountCurrency"
          viewMode="mixed"
          value={{
            amount: '2345',
            unit: 'USD',
          }}
          baseValue={{
            amount: 1345,
            unit: 'USD',
          }}
        />
      )
      expect(screen.getByTestId('amount-input-diff')).toBeInTheDocument()
      expect(screen.getByText('1345')).toBeInTheDocument()
      expect(screen.getByText('2345')).toBeInTheDocument()
    })

    it('should not render DateInputDiff when viewMode is edition', () => {
      render(
        <AmountInput
          type="AmountCurrency"
          name="amount"
          viewMode="edition"
          value={{
            amount: '345',
            unit: 'USD',
          }}
          baseValue={{
            amount: 345,
            unit: 'USD',
          }}
        />
      )
      expect(screen.queryByTestId('amount-input-diff')).not.toBeInTheDocument()
    })
  })
})
