import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithForm } from '../../lib/testing.js'
import { PasswordField } from './password-field.js'

describe('PasswordField Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = renderWithForm(
      <PasswordField name="password" label="Password field" placeholder="Password" />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    renderWithForm(<PasswordField name="password" label="Password field" />)
    expect(screen.getByText('Password field')).toBeInTheDocument()
  })

  it('should render with description', () => {
    renderWithForm(<PasswordField name="password" label="Password field" description="Password field description" />)
    expect(screen.getByText('Password field description')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    renderWithForm(<PasswordField name="password" label="Password field" disabled />)
    expect(screen.getByLabelText('Password field')).toBeDisabled()
  })

  it('should display error messages', async () => {
    renderWithForm(<PasswordField name="password" label="Password field" errors={['Invalid password']} />)
    await waitFor(() => {
      expect(screen.getByText('Invalid password')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    renderWithForm(
      <PasswordField
        name="password"
        label="Password field"
        warnings={['Please change your password as soon as possible']}
      />
    )
    expect(screen.getByText('Please change your password as soon as possible')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', async () => {
    renderWithForm(<PasswordField name="password" label="Password field" required errors={['Invalid password']} />)

    const input = screen.getByLabelText(/Password field/)
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should handle value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithForm(<PasswordField name="password" label="Password field" onChange={onChange} />)

    const input = screen.getByLabelText('Password field')
    await user.type(input, 'H0l4.mundo')
    expect(onChange).toHaveBeenCalledTimes(10)
    expect(input).toHaveValue('H0l4.mundo')
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    renderWithForm(
      <PasswordField name="password" label="Password field" defaultValue="H0l4.mundo" onChange={onChange} />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should validate password format on submit', async () => {
    const mockOnSubmit = vi.fn()
    const user = userEvent.setup()

    renderWithForm(
      <>
        <PasswordField name="password" label="Password field" />
        <button type="submit">Submit</button>
      </>,
      mockOnSubmit
    )

    const input = screen.getByLabelText('Password field')
    const submitButton = screen.getByText('Submit')

    // Test missing uppercase
    await user.type(input, 'invalidpass1!')
    await user.click(submitButton)
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    // Test missing lowercase
    await user.clear(input)
    await user.type(input, 'INVALIDPASS1!')
    await user.click(submitButton)
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    // Test missing numbers
    await user.clear(input)
    await user.type(input, 'invalidpass!')
    await user.click(submitButton)
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    // Test missing special characters
    await user.clear(input)
    await user.type(input, 'invalidpass1')
    await user.click(submitButton)
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    // Test valid password
    await user.clear(input)
    await user.type(input, 'ValidPass1!')
    await user.click(submitButton)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        password: 'ValidPass1!',
      })
    })
  })

  it('should not show error when matchFieldName is set and passwords match', async () => {
    const user = userEvent.setup()

    renderWithForm(
      <>
        <PasswordField name="password" label="Password" defaultValue="@A1a" />
        <PasswordField name="confirmPassword" label="Confirm password" matchFieldName="password" showErrorOnBlur />
      </>
    )

    const input = screen.getByLabelText('Confirm password')
    await user.type(input, '@A1a')
    await user.tab()

    expect(input).toHaveAttribute('aria-invalid', 'false')
  })
})
