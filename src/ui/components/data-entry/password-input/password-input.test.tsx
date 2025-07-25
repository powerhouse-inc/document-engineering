import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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

  it('should handle value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<PasswordInput name="password" label="Password input" onChange={onChange} />)

    const input = screen.getByLabelText('Password input')
    await user.type(input, 'H0l4.mundo')
    expect(onChange).toHaveBeenCalledTimes(10)
    expect(input).toHaveValue('H0l4.mundo')
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(<PasswordInput name="password" label="Password input" defaultValue="H0l4.mundo" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })

  describe('viewMode and diffs', () => {
    it('should not render diff component by default', () => {
      render(<PasswordInput name="password" label="Password input" />)
      expect(screen.queryByTestId('password-input-diff')).not.toBeInTheDocument()
    })

    it('should not render diff component when viewMode is explicitly set to edition', () => {
      render(<PasswordInput name="password" label="Password input" viewMode="edition" />)
      expect(screen.queryByTestId('password-input-diff')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(<PasswordInput name="password" label="Password input" viewMode="addition" value="new" baseValue="old" />)
      expect(screen.getByTestId('password-input-diff')).toBeInTheDocument()
      expect(screen.getByText('new')).toBeInTheDocument()
      expect(screen.queryByText('old')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(<PasswordInput name="password" label="Password input" viewMode="removal" value="new" baseValue="old" />)
      expect(screen.getByTestId('password-input-diff')).toBeInTheDocument()
      expect(screen.queryByText('new')).not.toBeInTheDocument()
      expect(screen.getByText('old')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(<PasswordInput name="password" label="Password input" viewMode="mixed" value="new" baseValue="old" />)
      expect(screen.getByTestId('password-input-diff')).toBeInTheDocument()
      expect(screen.getByText('new')).toBeInTheDocument()
      expect(screen.getByText('old')).toBeInTheDocument()
    })

    it('should handle empty value in diff mode', () => {
      const { container } = render(
        <PasswordInput name="password" label="Password input" viewMode="addition" value="" />
      )
      expect(screen.getByTestId('password-input-diff')).toBeInTheDocument()
      const diffSpans = container.querySelectorAll('span')
      diffSpans.forEach((span) => {
        expect(span).toHaveTextContent('')
      })
    })
  })
})
