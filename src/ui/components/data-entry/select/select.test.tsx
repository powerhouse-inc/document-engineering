import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './select.js'

describe('Select Component', () => {
  const defaultOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
  ]
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.Element.prototype.scrollTo = vi.fn()

  // Basic Rendering Tests
  it('should match snapshot', () => {
    const { asFragment } = render(<Select name="select" options={defaultOptions} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with custom placeholder', () => {
    render(<Select name="select" options={defaultOptions} placeholder="Custom placeholder" />)
    expect(screen.getByText('Custom placeholder')).toBeInTheDocument()
  })

  // Label Tests
  it('should render with label', () => {
    render(<Select name="select" options={defaultOptions} label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should show required indicator when required', () => {
    render(<Select name="select" options={defaultOptions} label="Test Label" required />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-required', 'true')
  })

  // Selection Behavior Tests
  it('should handle option selection', async () => {
    const onChangeMock = vi.fn()
    const user = userEvent.setup()

    render(<Select name="select" options={defaultOptions} onChange={onChangeMock} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))

    expect(onChangeMock).toHaveBeenCalledWith('1')
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('should not allow selection of disabled options', async () => {
    const onChangeMock = vi.fn()
    const user = userEvent.setup()

    render(<Select name="select" options={defaultOptions} onChange={onChangeMock} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 3')) // disabled option

    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it('should maintain selection when re-selecting the same option', async () => {
    const onChangeMock = vi.fn()
    const user = userEvent.setup()

    render(<Select name="select" options={defaultOptions} onChange={onChangeMock} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))

    expect(onChangeMock).toHaveBeenCalledWith('1')
    expect(screen.getByText('Option 1')).toBeInTheDocument()

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Option 1' }))

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })

  // Search Functionality Tests
  it('should show search input when searchable is true', async () => {
    const user = userEvent.setup()
    render(<Select name="select" options={defaultOptions} searchable />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('should filter options based on search input', async () => {
    const user = userEvent.setup()
    render(<Select name="select" options={defaultOptions} searchable />)

    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search...'), 'Option 1')

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
  })

  // Validation and Error Handling Tests
  it('should display error messages', async () => {
    render(<Select name="select" options={defaultOptions} errors={['This field is required']} />)
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(<Select name="select" options={defaultOptions} warnings={['Please review your selection']} />)
    expect(screen.getByText('Please review your selection')).toBeInTheDocument()
  })

  // Keyboard Navigation Tests
  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Select name="select" options={defaultOptions} />)

    screen.getByRole('combobox').focus()

    await user.keyboard('{Enter}') // Open dropdown
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}') // Close dropdown
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  // Edge Cases
  it('should handle empty options array', () => {
    render(<Select name="select" options={[]} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).toHaveAttribute('aria-expanded', 'false')
    expect(select).not.toBeDisabled()
    expect(select).toHaveTextContent('')
  })

  it('should handle value when provided', () => {
    render(<Select name="select" options={defaultOptions} value="2" />)
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  // Accessibility Tests
  it('should have correct ARIA attributes', async () => {
    render(<Select name="select" options={defaultOptions} label="Test Label" required errors={['Error message']} />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(select).toHaveAttribute('aria-invalid', 'true')
    })
    expect(select).toHaveAttribute('aria-expanded', 'false')
  })

  // Multiple Selection Tests
  it('should allow multiple selections when multiple is true', async () => {
    const onChangeMock = vi.fn()
    const user = userEvent.setup()

    render(<Select name="select" options={defaultOptions} onChange={onChangeMock} multiple />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))
    expect(onChangeMock).toHaveBeenCalledWith(['1'])
    await user.click(screen.getByText('Option 2'))
    expect(onChangeMock).toHaveBeenLastCalledWith(['1', '2'])
  })

  it('should keep popover closed and focus the select/button when clicking the label', async () => {
    const user = userEvent.setup()

    render(<Select name="select" options={defaultOptions} label="Test Label" />)

    const label = screen.getByText('Test Label')
    const select = screen.getByRole('combobox')
    await user.click(label)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(select).toHaveFocus()
  })

  it('should no invoke onChange on mount when it have a defaultValue', () => {
    const onChange = vi.fn()
    render(
      <Select
        name="name"
        label="Name"
        defaultValue={defaultOptions[0].value}
        options={defaultOptions}
        onChange={onChange}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  // Tests for viewMode and diffs functionality
  describe('viewMode and diffs', () => {
    it('should render in edition mode by default', () => {
      render(<Select name="select" options={defaultOptions} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render in edition mode when viewMode is explicitly set to edition', () => {
      render(<Select name="select" options={defaultOptions} viewMode="edition" />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(<Select name="select" options={defaultOptions} viewMode="addition" value="1" baseValue="2" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(<Select name="select" options={defaultOptions} viewMode="removal" value="1" baseValue="2" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(<Select name="select" options={defaultOptions} viewMode="mixed" value="1" baseValue="2" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should pass correct props to SelectDiff component', () => {
      render(
        <Select
          name="select"
          options={defaultOptions}
          viewMode="mixed"
          value="1"
          baseValue="2"
          label="Test Label"
          required
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should handle empty value in diff mode', () => {
      const { container } = render(<Select name="select" options={defaultOptions} viewMode="addition" value="" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      const diffSpans = container.querySelectorAll('span')
      diffSpans.forEach((span) => {
        expect(span).toHaveTextContent('')
      })
    })

    it('should fallback to showing the raw value when no matching option is found', () => {
      render(<Select name="select" options={defaultOptions} viewMode="mixed" value="11" baseValue="22" />)
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('11')).toBeInTheDocument()
      expect(screen.getByText('22')).toBeInTheDocument()
    })

    it('should handle the multiple prop in diff mode', () => {
      render(
        <Select name="select" options={defaultOptions} viewMode="addition" value={['Option 1', 'Option 2']} multiple />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument()
    })
  })
})
