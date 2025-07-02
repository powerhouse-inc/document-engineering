import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithForm } from '#scalars/lib/testing'
import { EmailInput } from '#ui/components/data-entry/email-input'

describe('EmailInput', () => {
  it('should match snapshot', () => {
    const { container } = renderWithForm(<EmailInput name="test" label="Test Label" />)
    expect(container).toMatchSnapshot()
  })
  it('should render with a label and input', () => {
    renderWithForm(<EmailInput label="Email Address" name="email" />)
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()

    const inputElement = screen.getByRole('textbox', { name: 'Email Address' })
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('type', 'email')
    expect(inputElement).toHaveAttribute('name', 'email')
  })

  it('should show required indicator when required', () => {
    renderWithForm(<EmailInput name="name" label="Name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should handle defaultValue correctly', async () => {
    renderWithForm(<EmailInput label="Email" name="email" />)
    const inputElement = screen.getByLabelText('Email')
    await userEvent.type(inputElement, 'changed@example.com')
    expect(inputElement).toHaveValue('changed@example.com')
  })

  it('should render with initial value', () => {
    renderWithForm(<EmailInput name="name" label="Name" value="changed@example.com" onChange={() => null} />)
    expect(screen.getByDisplayValue('changed@example.com')).toBeInTheDocument()
  })

  it('should render with default value', () => {
    renderWithForm(<EmailInput name="name" label="Name" defaultValue="default@example.com" />)
    expect(screen.getByDisplayValue('default@example.com')).toBeInTheDocument()
  })

  it('should render description, warnings, and errors', () => {
    const warnings = ['This is a warning']
    const errors = ['This is an error']
    renderWithForm(
      <EmailInput label="Email" name="email" description="Enter your email" warnings={warnings} errors={errors} />
    )

    expect(screen.getByText('Enter your email')).toBeInTheDocument()
    expect(screen.getByText('This is a warning')).toBeInTheDocument()
    expect(screen.getByText('This is an error')).toBeInTheDocument()
  })

  it('should disable the input when disabled prop is true', () => {
    render(<EmailInput label="Email" name="email" disabled />)
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })

  it('should set autoComplete to "email" when autoComplete is true', () => {
    render(<EmailInput label="Email" name="email" autoComplete={true} />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('autoComplete', 'email')
  })

  it('should set autoComplete to "off" when autoComplete is false', () => {
    render(<EmailInput label="Email" name="email" autoComplete={false} />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('autoComplete', 'off')
  })

  it('should not set autoComplete when autoComplete is undefined', () => {
    render(<EmailInput label="Email" name="email" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('autoComplete')
  })
})
