import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PhoneNumberInput } from './phone-number-input.js'

describe('PhoneNumberInput Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<PhoneNumberInput name="phone" label="Phone number" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(<PhoneNumberInput name="phone" label="Phone number" />)
    expect(screen.getByText('Phone number')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<PhoneNumberInput name="phone" description="Phone number description" />)
    expect(screen.getByText('Phone number description')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<PhoneNumberInput name="phone" disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should display error messages', async () => {
    render(<PhoneNumberInput name="phone" errors={['Invalid phone number']} />)
    await waitFor(() => {
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument()
    })
  })

  it('should display warning messages', () => {
    render(<PhoneNumberInput name="phone" warnings={['You must change your phone number']} />)
    expect(screen.getByText('You must change your phone number')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', async () => {
    render(<PhoneNumberInput name="phone" required errors={['Invalid phone number']} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should handle input value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<PhoneNumberInput name="phone" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '4155552671')
    expect(onChange).toHaveBeenCalledTimes(10)
    expect(input).toHaveValue('4155552671')
  })

  it('should handle select value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PhoneNumberInput name="phone" onChange={onChange} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    const list = await screen.findByRole('dialog')
    const search = within(list).getByRole('combobox')
    await user.type(search, '33')

    const option = await screen.findByRole('option', { name: '+33' })
    await user.click(option)

    expect(onChange).toHaveBeenLastCalledWith('+33')
    expect(screen.getByRole('combobox')).toHaveTextContent('+33')
  })

  it('should handle defaultValue', async () => {
    render(<PhoneNumberInput name="phone" defaultValue="+442079460000" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('20 7946 0000')

    const select = screen.getByRole('combobox')
    expect(select).toHaveTextContent('+44')

    await userEvent.click(select)
    const list = await screen.findByRole('dialog')
    const search = within(list).getByRole('combobox')
    await userEvent.type(search, '44')

    const usOption = await screen.findByRole('option', { name: '+44' })
    expect(usOption).toHaveAttribute('aria-selected', 'true')
  })

  it('should not allow letters on key down', async () => {
    const onKeyDown = vi.fn()
    render(<PhoneNumberInput name="phone" onKeyDown={onKeyDown} />)
    const input = screen.getByRole('textbox')

    await userEvent.click(input)
    await userEvent.keyboard('a')

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    const eventArg = onKeyDown.mock.calls[0]?.[0] as React.KeyboardEvent<HTMLInputElement>
    expect(eventArg.defaultPrevented).toBe(true)
  })

  it('should handle diferent prefix option formats', async () => {
    const cases = [
      { format: 'CodesOnly', expectedLength: 2 },
      { format: 'FlagsOnly', expectedLength: 0 },
      { format: 'FlagsAndCodes', expectedLength: 2 },
      { format: 'FlagsAndNumbers', expectedLength: 2 },
    ] as const

    for (const c of cases) {
      const { unmount } = render(<PhoneNumberInput name="phone" prefixOptionFormat={c.format} />)

      const select = screen.getByRole('combobox')
      await userEvent.click(select)

      const list = await screen.findByRole('dialog')
      const search = within(list).getByRole('combobox')
      await userEvent.type(search, '+1')

      const options = await screen.findAllByRole('option')
      const [opt] = options
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      expect(opt.textContent?.length).toBe(c.expectedLength)

      unmount()
    }
  })

  it('should not invoke onChange on mount when it has a defaultValue', () => {
    const onChange = vi.fn()
    render(<PhoneNumberInput name="phone" defaultValue="+14155552671" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should filter countries based on allowedCountries prop', async () => {
    const user = userEvent.setup()
    render(<PhoneNumberInput name="phone" allowedCountries={['US', 'GB']} prefixOptionFormat="CodesOnly" />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('US')).toBeInTheDocument()
    expect(screen.getByText('GB')).toBeInTheDocument()
    expect(screen.queryByText('FR')).not.toBeInTheDocument()
  })

  it('should filter out countries based on excludedCountries prop', async () => {
    const user = userEvent.setup()
    render(<PhoneNumberInput name="phone" excludedCountries={['FR', 'DE']} prefixOptionFormat="CodesOnly" />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('US')).toBeInTheDocument()
    expect(screen.getByText('GB')).toBeInTheDocument()
    expect(screen.queryByText('FR')).not.toBeInTheDocument()
    expect(screen.queryByText('DE')).not.toBeInTheDocument()
  })

  it('should handle both allowedCountries and excludedCountries props', async () => {
    const user = userEvent.setup()
    render(
      <PhoneNumberInput
        name="phone"
        allowedCountries={['US', 'GB']}
        excludedCountries={['FR']}
        prefixOptionFormat="CodesOnly"
      />
    )

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('US')).toBeInTheDocument()
    expect(screen.getByText('GB')).toBeInTheDocument()
    expect(screen.queryByText('FR')).not.toBeInTheDocument()
  })

  it('should include dependent areas when includeDependentAreas is true', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<PhoneNumberInput name="phone" includeDependentAreas prefixOptionFormat="CodesOnly" onChange={onChange} />)

    const select = screen.getByRole('combobox')
    await user.click(select)

    expect(screen.getByText('PR')).toBeInTheDocument() // US territory
    expect(screen.getByText('GU')).toBeInTheDocument() // US territory

    await user.click(screen.getByText('PR'))
    expect(onChange).toHaveBeenCalledWith('+1')

    expect(screen.getByText('PR')).toBeInTheDocument()
  })

  it('should position cursor at end when auto-detecting country', async () => {
    const user = userEvent.setup()
    render(<PhoneNumberInput name="phone" />)

    const input: HTMLInputElement = screen.getByRole('textbox')
    await user.type(input, '14155552671')

    expect(input.selectionStart).toBe(12)
  })

  describe('viewMode and diffs', () => {
    it('should not render diff component by default', () => {
      render(<PhoneNumberInput name="phone" />)
      expect(screen.queryByTestId('phone-number-input-diff')).not.toBeInTheDocument()
    })

    it('should not render diff component when viewMode is explicitly set to edition', () => {
      render(<PhoneNumberInput name="phone" viewMode="edition" />)
      expect(screen.queryByTestId('phone-number-input-diff')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is addition', () => {
      render(<PhoneNumberInput name="phone" viewMode="addition" value="+14155552671" baseValue="+442079460000" />)
      expect(screen.getByTestId('phone-number-input-diff')).toBeInTheDocument()
      expect(screen.getByText('415 555 2671')).toBeInTheDocument()
      expect(screen.queryByText('20 7946 0000')).not.toBeInTheDocument()
    })

    it('should render diff component when viewMode is removal', () => {
      render(<PhoneNumberInput name="phone" viewMode="removal" value="+14155552671" baseValue="+442079460000" />)
      expect(screen.getByTestId('phone-number-input-diff')).toBeInTheDocument()
      expect(screen.queryByText('415 555 2671')).not.toBeInTheDocument()
      expect(screen.getByText('20 7946 0000')).toBeInTheDocument()
    })

    it('should render diff component when viewMode is mixed', () => {
      render(<PhoneNumberInput name="phone" viewMode="mixed" value="+14155552671" baseValue="+442079460000" />)
      expect(screen.getByTestId('phone-number-input-diff')).toBeInTheDocument()
      expect(screen.getByText('415 555 2671')).toBeInTheDocument()
      expect(screen.getByText('20 7946 0000')).toBeInTheDocument()
    })
  })
})
