import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AIDInput } from './aid-input.js'

describe('AIDInput Component', () => {
  const mockedOptions = [
    {
      icon: 'Person' as const,
      title: 'Agent A',
      path: {
        text: 'renown.id/0xb9c5714089478a327f09197987f16f9e5d936e8a',
        url: 'https://www.renown.id/',
      },
      value: 'did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a',
      description: 'Agent A description',
      agentType: 'Human Contributor',
    },
    {
      icon: 'Person' as const,
      title: 'Agent B',
      path: {
        text: 'renown.id/0x5:0xb9c5714089478a327f09197987f16f9e5d936e8a',
        url: 'https://www.renown.id/',
      },
      value: 'did:ethr:0x5:0xb9c5714089478a327f09197987f16f9e5d936e8a',
      description: 'Agent B description',
      agentType: 'Contributor Team',
    },
  ]

  const defaultGetOptions = vi.fn().mockResolvedValue(mockedOptions)
  const defaultGetSelectedOption = vi.fn().mockImplementation((value: string) => {
    return mockedOptions.find((option) => option.value === value)
  })

  it('should match snapshot', () => {
    const { asFragment } = render(
      <AIDInput
        name="aid"
        label="AID Input"
        placeholder="did:ethr:"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(
      <AIDInput
        name="aid"
        label="Test Label"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(
      <AIDInput
        name="aid"
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
      <AIDInput
        name="aid"
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
      <AIDInput
        name="aid"
        label="Test Label"
        errors={['Invalid AID format']}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    await waitFor(() => {
      expect(screen.getByText('Invalid AID format')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(
      <AIDInput
        name="aid"
        label="Test Label"
        warnings={['AID may be deprecated']}
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )
    expect(screen.getByText('AID may be deprecated')).toBeInTheDocument()
  })

  it('should show autocomplete options', async () => {
    const user = userEvent.setup()
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(1)

    render(
      <AIDInput
        name="aid"
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
      expect(defaultGetOptions).toHaveBeenCalledWith('test', {
        supportedNetworks: undefined,
      })
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
      <AIDInput
        name="aid"
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
      <AIDInput
        name="aid"
        label="Test Label"
        variant="withValueTitleAndDescription"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.getByText('Title not available')).toBeInTheDocument()
    expect(screen.getByText('URL not available')).toBeInTheDocument()
    expect(screen.getByText('Description not available')).toBeInTheDocument()
    expect(screen.getByText('Agent type not available')).toBeInTheDocument()

    rerender(
      <AIDInput
        name="aid"
        label="Test Label"
        variant="withValueAndTitle"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.getByText('Title not available')).toBeInTheDocument()
    expect(screen.getByText('URL not available')).toBeInTheDocument()
    expect(screen.queryByText('Description not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Agent type not available')).not.toBeInTheDocument()

    rerender(
      <AIDInput
        name="aid"
        label="Test Label"
        variant="withValue"
        fetchOptionsCallback={defaultGetOptions}
        fetchSelectedOptionCallback={defaultGetSelectedOption}
      />
    )

    expect(screen.queryByText('Title not available')).not.toBeInTheDocument()
    expect(screen.queryByText('URL not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Description not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Agent type not available')).not.toBeInTheDocument()
  })

  it('should handle autoComplete disabled', () => {
    render(<AIDInput name="aid" label="Test Label" autoComplete={false} />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should handle value changes and auto selection', async () => {
    const user = userEvent.setup()
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(1)

    render(
      <AIDInput
        name="aid"
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
      expect(screen.getByText(mockedOptions[0].path.text)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].description)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].agentType)).toBeInTheDocument()
    })

    Math.random = originalRandom
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(
      <AIDInput
        name="aid"
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
        <AIDInput
          name="aid"
          label="Test Label"
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should render in edition mode when viewMode is explicitly set to edition', () => {
      render(
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
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
        <AIDInput
          name="aid"
          label="Test Label"
          viewMode="addition"
          value={mockedOptions[0].value}
          initialOptions={mockedOptions}
          variant="withValueTitleAndDescription"
          fetchOptionsCallback={defaultGetOptions}
          fetchSelectedOptionCallback={defaultGetSelectedOption}
        />
      )
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].value)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].path.text)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].description)).toBeInTheDocument()
      expect(screen.getByText(mockedOptions[0].agentType)).toBeInTheDocument()
    })
  })
})
