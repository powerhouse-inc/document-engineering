import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PhoneNumberInput } from './phone-number-input.js'

describe('PhoneNumberInput Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<PhoneNumberInput name="phone" label="Phone number input" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(<PhoneNumberInput name="phone" label="Phone number input" />)
    expect(screen.getByText('Phone number input')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<PhoneNumberInput name="phone" description="Phone number input description" />)
    expect(screen.getByText('Phone number input description')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<PhoneNumberInput name="phone" disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should display error messages', async () => {
    render(<PhoneNumberInput name="phone" errors={['Invalid phone number']} />)
    await waitFor(() => {
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(<PhoneNumberInput name="phone" warnings={['Please change your phone number']} />)
    expect(screen.getByText('Please change your phone number')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', async () => {
    render(<PhoneNumberInput name="phone" label="Phone number input" required errors={['Invalid phone number']} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should handle input value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<PhoneNumberInput name="phone" label="Phone number input" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '4155552671')
    expect(onChange).toHaveBeenCalledTimes(10)
    expect(input).toHaveValue('4155552671')
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(<PhoneNumberInput name="phone" label="Phone number input" defaultValue="+14155552671" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })
})
