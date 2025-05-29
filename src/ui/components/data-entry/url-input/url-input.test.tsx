import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { UrlInput } from './url-input.js'

describe('UrlInput', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <UrlInput
        name="test-url"
        label="Website URL"
        description="Enter your website URL"
        placeholder="https://example.com"
        required
        warnings={['URL may be unreachable']}
        errors={['Invalid URL format']}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('should render with basic props', () => {
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" placeholder="https://example.com" />)

    expect(screen.getByTestId('url-field')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()
  })

  it('should show required indicator when required', () => {
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" required />)

    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByTestId('url-field')).toHaveAttribute('required')
  })

  it('should show description when provided', () => {
    render(<UrlInput name="test-url" label="Website URL" description="Enter your website URL" />)

    expect(screen.getByText('Enter your website URL')).toBeInTheDocument()
  })

  it('should show error message when provided', async () => {
    render(<UrlInput name="test-url" label="Website URL" errors={['Invalid URL format']} />)

    await waitFor(() => {
      expect(screen.getByText('Invalid URL format')).toBeInTheDocument()
    })
  })

  it('should show warning message when provided', () => {
    render(<UrlInput name="test-url" label="Website URL" warnings={['URL may be unreachable']} />)

    expect(screen.getByText('URL may be unreachable')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" disabled />)

    expect(screen.getByTestId('url-field')).toBeDisabled()
  })

  it('should show warning when the URL could be truncated', async () => {
    const user = userEvent.setup()
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" />)

    const input = screen.getByTestId('url-field')
    await user.type(input, 'https://example.com/test...')
    await user.tab() // trigger blur

    expect(await screen.findByText('URL may be truncated')).toBeInTheDocument()
  })

  it('should not show warnings if showWarnings prop is false', async () => {
    const user = userEvent.setup()
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" showWarnings={false} />)

    const input = screen.getByTestId('url-field')
    await user.type(input, 'https://example.com/test...')
    await user.tab() // trigger blur

    expect(screen.queryByText('URL may be truncated')).not.toBeInTheDocument()
  })

  it('should render platform built-in icon when URL matches configured hostname', () => {
    render(
      <UrlInput
        data-testid="url-field"
        name="test-url"
        label="Website URL"
        value="https://github.com/test"
        platformIcons={{
          'github.com': 'Github',
        }}
      />
    )

    expect(screen.getByTestId('icon-fallback')).toBeInTheDocument()
  })

  it('should render a custom icon when hostname has no configured icon', () => {
    render(
      <UrlInput
        data-testid="url-field"
        name="test-url"
        label="Website URL"
        value="https://github.com/test"
        platformIcons={{
          'github.com': <span data-testid="custom-icon">Custom Icon</span>,
        }}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should not render any icon when platformIcons prop is not provided', () => {
    render(<UrlInput data-testid="url-field" name="test-url" label="Website URL" />)

    expect(screen.queryByTestId('icon-fallback')).not.toBeInTheDocument()
  })
})
