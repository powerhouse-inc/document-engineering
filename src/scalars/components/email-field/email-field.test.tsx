import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithForm } from '../../lib/testing.js'
import { EmailField } from './email-field'

describe('EmailField', () => {
  it('should match snapshot', () => {
    const { container } = renderWithForm(<EmailField name="test" label="Test Label" />)
    expect(container).toMatchSnapshot()
  })
  it('should render with a label and input', () => {
    renderWithForm(<EmailField label="Email Address" name="email" />)
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()

    const inputElement = screen.getByRole('textbox', { name: 'Email Address' })
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('type', 'email')
    expect(inputElement).toHaveAttribute('name', 'email')
  })

  it('should show required indicator when required', () => {
    renderWithForm(<EmailField name="name" label="Name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should handle defaultValue correctly', async () => {
    renderWithForm(<EmailField label="Email" name="email" />)
    const inputElement = screen.getByLabelText('Email')
    await userEvent.type(inputElement, 'changed@example.com')
    expect(inputElement).toHaveValue('changed@example.com')
  })

  it('should render with initial value', () => {
    renderWithForm(<EmailField name="name" label="Name" value="changed@example.com" onChange={() => null} />)
    expect(screen.getByDisplayValue('changed@example.com')).toBeInTheDocument()
  })

  it('should render with default value', () => {
    renderWithForm(<EmailField name="name" label="Name" defaultValue="default@example.com" />)
    expect(screen.getByDisplayValue('default@example.com')).toBeInTheDocument()
  })

  it('should render description, warnings, and errors', async () => {
    const warnings = ['This is a warning']
    const errors = ['This is an error']
    renderWithForm(
      <EmailField label="Email" name="email" description="Enter your email" warnings={warnings} errors={errors} />
    )
    await waitFor(() => {
      expect(screen.getByText('Enter your email')).toBeInTheDocument()
      expect(screen.getByText('This is a warning')).toBeInTheDocument()
      expect(screen.getByText('This is an error')).toBeInTheDocument()
    })
  })

  it('should disable the input when disabled prop is true', () => {
    renderWithForm(<EmailField label="Email" name="email" disabled />)
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })

  it('should set autoComplete to "email" when autoComplete is true', () => {
    renderWithForm(<EmailField label="Email" name="email" autoComplete={true} />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('autoComplete', 'email')
  })

  it('should set autoComplete to "off" when autoComplete is false', () => {
    renderWithForm(<EmailField label="Email" name="email" autoComplete={false} />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('autoComplete', 'off')
  })

  it('should not set autoComplete when autoComplete is undefined', () => {
    renderWithForm(<EmailField label="Email" name="email" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('autoComplete')
  })

  it('should validate email', async () => {
    renderWithForm(<EmailField label="Email" name="email" showErrorOnBlur />)
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'test@.org')
    await userEvent.tab()
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
  })

  it('should validate email with the allowed domains', async () => {
    const allowedDomains = ['example.com', 'company.org']
    renderWithForm(<EmailField label="Email" name="email" allowedDomains={allowedDomains} showErrorOnBlur />)
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'test@company.org')
    await userEvent.tab()
    expect(screen.queryByText('Email domain must be one of: example.com, company.org')).not.toBeInTheDocument()
    expect(input).toHaveValue('test@company.org')
  })
  describe('EmailField differences', () => {
    it('should show value when viewMode is addition', () => {
      renderWithForm(
        <EmailField value="test@example.com" baseValue="other@example.com" viewMode="addition" name="Label" />
      )

      const input = screen.getByTestId('email-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.queryByText('other@example.com')).not.toBeInTheDocument()
    })

    it('should show baseValue when viewMode is removal', () => {
      renderWithForm(
        <EmailField value="test@example.com" baseValue="other@example.com" viewMode="removal" name="Label" />
      )

      const input = screen.getByTestId('email-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
      expect(screen.getByText('other@example.com')).toBeInTheDocument()
    })

    it('should show value and baseValue when viewMode is mixed', () => {
      renderWithForm(
        <EmailField value="test@example.com" baseValue="other@example.com" viewMode="mixed" name="Label" />
      )

      const input = screen.getByTestId('email-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('other@example.com')).toBeInTheDocument()
    })
  })

  it('should not show error when emails match', async () => {
    renderWithForm(
      <div>
        <EmailField label="Email" name="email" value="test@example.com" />
        <EmailField label="Confirm Email" name="confirmEmail" matchFieldName="email" showErrorOnBlur />
      </div>
    )

    const input = screen.getByRole('textbox', { name: 'Confirm Email' })
    await userEvent.type(input, 'test@example.com')
    await userEvent.tab()

    expect(screen.queryByText('Email must match the email field')).not.toBeInTheDocument()
  })

  it('should not validate match when matchFieldName is not provided', async () => {
    renderWithForm(
      <div>
        <EmailField label="Email" name="email" showErrorOnBlur value="example@example.com" />
        <EmailField label="Confirm Email" name="confirmEmail" matchFieldName="email" showErrorOnBlur />
      </div>
    )
    const input = screen.getByRole('textbox', { name: 'Confirm Email' })
    await userEvent.type(input, 'test@example.com')
    await userEvent.tab()
    const errorMessage = screen.getByText('Email must match the Email field')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should use matchFieldLabel in error message when provided', async () => {
    renderWithForm(
      <div>
        <EmailField label="Email Address" name="email" showErrorOnBlur value="example@example.com" />
        <EmailField label="Confirm Email" name="confirmEmail" matchFieldName="email" showErrorOnBlur />
      </div>
    )
    const input = screen.getByRole('textbox', { name: 'Confirm Email' })
    await userEvent.type(input, 'test@example.com')
    await userEvent.tab()
    const errorMessage = screen.getByText('Email must match the Email Address field')
    expect(errorMessage).toBeInTheDocument()
  })
  it('should accept valid email formats with special characters', async () => {
    renderWithForm(<EmailField label="Email" name="email" showErrorOnBlur />)
    const input = screen.getByLabelText('Email')

    // Test valid emails with special characters allowed by the regex
    const validEmails = [
      'user+tag@example.com',
      'user.name@domain.co.uk',
      'user_name@subdomain.example.org',
      'user-name@domain.com',
    ]

    for (const email of validEmails) {
      await userEvent.clear(input)
      await userEvent.type(input, email)
      await userEvent.tab()
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    }
  })

  it('should reject invalid email formats', async () => {
    renderWithForm(<EmailField label="Email" name="email" showErrorOnBlur />)
    const input = screen.getByLabelText('Email')

    // Test invalid emails that should be rejected by the regex
    const invalidEmails = [
      'user@',
      '@domain.com',
      'user@domain',
      'user..name@domain.com',
      'user@domain..com',
      'user name@domain.com',
    ]

    for (const email of invalidEmails) {
      await userEvent.clear(input)
      await userEvent.type(input, email)
      await userEvent.tab()
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    }
  })
})
