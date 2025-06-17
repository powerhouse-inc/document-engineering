import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OIDInput } from './oid-input.js'

describe('OIDInput Component', () => {
  const mockedOptions = [
    {
      icon: 'Braces' as const,
      title: 'Object A',
      path: 'rwa-portfolio-a',
      value: 'baefc2a4-f9a0-4950-8161-fd8d8cc7dea7',
      description: 'Object A description',
    },
    {
      icon: 'Braces' as const,
      title: 'Object B',
      path: 'rwa-portfolio-b',
      value: 'baefc2a4-f9a0-4950-8161-fd8d8cc6cdb8',
      description: 'Object B description',
    },
  ]

  const defaultGetOptions = vi.fn().mockResolvedValue(mockedOptions)
  const defaultGetSelectedOption = vi.fn().mockImplementation((value: string) => {
    return mockedOptions.find((option) => option.value === value)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(
      <OIDInput
        name="oid"
        label="OID Input"
        placeholder="uuid"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        description="Test Description"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        disabled
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should display error messages', async () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        errors={['Invalid OID format']}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    await waitFor(() => {
      expect(screen.getByText('Invalid OID format')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        warnings={['OID may be deprecated']}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByText('OID may be deprecated')).toBeInTheDocument()
  })

  it('should show autocomplete options', async () => {
    const user = userEvent.setup()
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(1)

    render(
      <OIDInput
        name="oid"
        label="Test Label"
        variant="withValueTitleAndDescription"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.clear(input)
    await user.type(input, 'test')

    await waitFor(() => {
      expect(defaultGetOptions).toHaveBeenCalledWith('test', {})
    })

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText(mockedOptions[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[1].title)).toBeInTheDocument()
    })

    Math.random = originalRandom
  })

  it('should have correct ARIA attributes', async () => {
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        required
        errors={['Error message']}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('should show correct placeholders for different variants', () => {
    const { rerender } = render(
      <OIDInput
        name="oid"
        label="Test Label"
        variant="withValueTitleAndDescription"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.getByText('Title not available')).toBeInTheDocument()
    expect(screen.getByText('Type not available')).toBeInTheDocument()
    expect(screen.getByText('Description not available')).toBeInTheDocument()

    rerender(
      <OIDInput
        name="oid"
        label="Test Label"
        variant="withValueAndTitle"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.getByText('Title not available')).toBeInTheDocument()
    expect(screen.getByText('Type not available')).toBeInTheDocument()
    expect(screen.queryByText('Description not available')).not.toBeInTheDocument()

    rerender(
      <OIDInput
        name="oid"
        label="Test Label"
        variant="withValue"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.queryByText('Title not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Type not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Description not available')).not.toBeInTheDocument()
  })

  it('should handle autoComplete disabled', () => {
    render(<OIDInput name="oid" label="Test Label" autoComplete={false} />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should handle value changes and auto selection', async () => {
    const user = userEvent.setup()
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(1)

    render(
      <OIDInput
        name="oid"
        label="Test Label"
        variant="withValueTitleAndDescription"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.type(input, mockedOptions[0].value)

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'false')
    })

    await waitFor(() => {
      expect(screen.getByText(mockedOptions[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].path)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].description)).toBeInTheDocument()
    })

    Math.random = originalRandom
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(
      <OIDInput
        name="oid"
        label="Test Label"
        defaultValue={mockedOptions[0].value}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
        onChange={onChange}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  // Tests for viewMode and diffs functionality
  describe('viewMode and diffs', () => {
    it('should render in edition mode by default', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render in edition mode when viewMode is explicitly set to edition', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="edition"
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="addition"
          value={mockedOptions[0].value}
          baseValue={mockedOptions[1].value}
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].value)).toBeInTheDocument()
      expect(screen.queryByText(mockedOptions[1].value)).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="removal"
          value={mockedOptions[0].value}
          baseValue={mockedOptions[1].value}
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText(mockedOptions[1].value)).toBeInTheDocument()
      expect(screen.queryByText(mockedOptions[0].value)).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="mixed"
          value={mockedOptions[0].value}
          baseValue={mockedOptions[1].value}
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].value)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[1].value)).toBeInTheDocument()
    })

    it('should pass correct props to diff component', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="mixed"
          value={mockedOptions[0].value}
          baseValue={mockedOptions[1].value}
          required
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].value)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[1].value)).toBeInTheDocument()
    })

    it('should handle empty value in diff mode', () => {
      const { container } = render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="addition"
          value=""
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      const diffSpans = container.querySelectorAll('span')
      diffSpans.forEach((span) => {
        expect(span).toHaveTextContent('')
      })
    })

    it('should respect variant in diff mode', () => {
      render(
        <OIDInput
          name="oid"
          label="Test Label"
          viewMode="addition"
          value={mockedOptions[0].value}
          initialOptions={mockedOptions}
          variant="withValueAndTitle"
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].value)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].path)).toBeInTheDocument()
      expect(screen.queryByText(mockedOptions[0].description)).not.toBeInTheDocument()
    })
  })
})
