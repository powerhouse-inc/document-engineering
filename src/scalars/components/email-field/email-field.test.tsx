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

  it('should validate email domain', async () => {
    const allowedDomains = ['example.com', 'company.org']
    renderWithForm(
      <EmailField label="Email" name="email" allowedDomains={allowedDomains} value="test@test.co" showErrorOnBlur />
    )
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'user@invalid.com')
    await userEvent.tab()
    expect(screen.getByText('Email domain must be one of: example.com, company.org')).toBeInTheDocument()
  })
  it('should validate email', async () => {
    renderWithForm(<EmailField label="Email" name="email" showErrorOnBlur />)
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'test@.org')
    await userEvent.tab()
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
  })
  it('should validate email domain', async () => {
    const allowedDomains = ['example.com', 'company.org']
    renderWithForm(<EmailField label="Email" name="email" allowedDomains={allowedDomains} showErrorOnBlur />)
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'test@company.org')
    await userEvent.tab()
    expect(screen.queryByText('Email domain must be one of: example.com, company.org')).not.toBeInTheDocument()
    expect(input).toHaveValue('test@company.org')
  })
})
