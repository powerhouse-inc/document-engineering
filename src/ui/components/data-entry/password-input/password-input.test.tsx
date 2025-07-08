import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PasswordInput } from './password-input.js'

describe('PasswordInput Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<PasswordInput name="password" label="Password input" placeholder="Password" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(<PasswordInput name="password" label="Password input" />)
    expect(screen.getByText('Password input')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<PasswordInput name="password" label="Password input" description="Password input description" />)
    expect(screen.getByText('Password input description')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<PasswordInput name="password" label="Password input" disabled />)
    expect(screen.getByLabelText('Password input')).toBeDisabled()
  })

  it('should display error messages', async () => {
    render(<PasswordInput name="password" label="Password input" errors={['Invalid password']} />)
    await waitFor(() => {
      expect(screen.getByText('Invalid password')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(
      <PasswordInput
        name="password"
        label="Password input"
        warnings={['Please change your password as soon as possible']}
      />
    )
    expect(screen.getByText('Please change your password as soon as possible')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', async () => {
    render(<PasswordInput name="password" label="Password input" required errors={['Invalid password']} />)

    const input = screen.getByLabelText(/Password input/)
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(<PasswordInput name="password" label="Password input" defaultValue="H0l4.mundo" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })
})
