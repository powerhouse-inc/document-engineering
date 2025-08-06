import { fireEvent, render, screen } from '@testing-library/react'
import { NumberInput } from './number-input'
import { userEvent } from '@testing-library/user-event'
import { MAX_SAFE_INTEGER } from '../../../../scalars/components/number-field/number-field-validations.js'

describe('NumberInput', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should match snapshot', () => {
    const { container } = render(
      <NumberInput label="Test Label" name="Label" value={345} trailingZeros precision={2} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render error messages when provided', () => {
    render(<NumberInput label="Test Label" onChange={mockOnChange} errors={['Error 1', 'Error 2']} name="Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render label when label is provided', () => {
    render(<NumberInput label="Test Label" onChange={mockOnChange} name="Label" />)
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('should render the description when provided', () => {
    render(<NumberInput label="Test Label" description="This is a description" onChange={mockOnChange} name="Label" />)
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('should render error messages when provided', () => {
    render(<NumberInput label="Test Label" onChange={mockOnChange} errors={['Error 1', 'Error 2']} name="Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render warning messages when provided', () => {
    render(
      <NumberInput label="Test Label" onChange={mockOnChange} warnings={['Warning 1', 'Warning 2']} name="Label" />
    )
    expect(screen.getByText('Warning 1')).toBeInTheDocument()
    expect(screen.getByText('Warning 2')).toBeInTheDocument()
  })

  it('should disable the input when disabled prop is true', () => {
    render(<NumberInput label="Test Label" onChange={mockOnChange} disabled name="Label" />)
    const input = screen.getByLabelText('Test Label')

    expect(input).toBeDisabled()
  })

  it('should show the input as required when required prop is true', () => {
    render(<NumberInput label="Test Label" onChange={mockOnChange} required name="Label" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('required')
  })

  it('should decrement value when decrement button is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Test Label" name="Label" value={10} step={2} onChange={mockOnChange} />)
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    // Ensure that the input has focus
    expect(input).toHaveFocus()

    const decrementButton = screen.getByRole('button', { name: /Decrement/i })
    await user.click(decrementButton)
    // Ensure that the input has focus
    expect(mockOnChange).toHaveBeenCalledTimes(1)

    const eventArg = mockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>

    expect(eventArg.target).toMatchObject({
      value: 8,
    })
  })

  it('should not exceed maxValue when increment button is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Test Label" name="Label" value={10} maxValue={10} step={1} onChange={mockOnChange} />)
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    // Ensure that the input has focus
    expect(input).toHaveFocus()

    const incrementButton = screen.getByRole('button', { name: /Increment/i })
    await user.click(incrementButton)
    // // Asegúrate de que el input tiene foco
    expect(mockOnChange).toHaveBeenCalledTimes(1)

    const eventArg = mockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>

    expect(eventArg.target.value).toBe('10')
  })

  it('should not go below minValue when decrement button is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Test Label" name="Label" value={1} minValue={1} step={1} onChange={mockOnChange} />)
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    // Ensure that the input has focus
    expect(input).toHaveFocus()

    const decrementButton = screen.getByRole('button', { name: /Decrement/i })
    await user.click(decrementButton)
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    const eventArg = mockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>

    expect(eventArg.target.value).toBe('1')
  })

  it('should show placeholder when value is empty', async () => {
    const placeholder = 'Enter a number'
    const user = userEvent.setup()

    render(<NumberInput label="Number Field" name="numberField" placeholder={placeholder} />)

    const input = screen.getByLabelText('Number Field')
    await user.clear(input)

    expect(input).toHaveAttribute('placeholder', placeholder)
    expect(input).toHaveValue('')
  })
  it('should show placeholder when value is empty', async () => {
    const placeholder = 'Enter a number'
    const user = userEvent.setup()

    render(<NumberInput label="Number Field" name="numberField" placeholder={placeholder} />)

    const input = screen.getByLabelText('Number Field')
    await user.clear(input)

    expect(input).toHaveAttribute('placeholder', placeholder)
  })

  it('should increment by specified step using keyboard', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(<NumberInput label="Step Field" name="stepField" value={10} step={2} onChange={mockOnChange} />)

    const input = screen.getByLabelText('Step Field')
    await user.click(input) // Focus the input first

    // Simulate ArrowUp key press
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    const upEvent = mockOnChange.mock.calls[
      mockOnChange.mock.calls.length - 1
    ][0] as React.ChangeEvent<HTMLInputElement>
    expect(upEvent.target.value).toBe(12)
  })
  it('should decrement by specified step using keyboard', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(<NumberInput label="Step Field" name="stepField" value={10} step={2} onChange={mockOnChange} />)

    const input = screen.getByLabelText('Step Field')
    await user.click(input) // Focus the input first

    // Simulate ArrowDown key press
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const downEvent = mockOnChange.mock.calls[
      mockOnChange.mock.calls.length - 1
    ][0] as React.ChangeEvent<HTMLInputElement>
    expect(downEvent.target.value).toBe(8)
  })

  it('should call onChange when the input value changes', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Test Label" name="Label" />)
    const input = screen.getByLabelText('Test Label')

    await user.clear(input)
    await user.type(input, '10')
    await user.tab()

    expect(input).toHaveValue('10')
  })

  // // Test for step
  it('should increment the value when increment arrow button is clicked', async () => {
    const user = userEvent.setup()

    render(<NumberInput label="Test Label" name="Label" value={5} step={1} onChange={mockOnChange} />)

    const input = screen.getByRole('spinbutton')
    await user.click(input) // Simula el clic en el input

    // Ensure that the input has focus
    expect(input).toHaveFocus()

    const incrementButton = screen.getByRole('button', { name: /Increment/i })
    await user.click(incrementButton)

    // Verify that `mockOnChange` was called and that the input remains focused
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveFocus()
    const eventArg = mockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>

    expect(eventArg.target).toMatchObject({
      value: 6,
    })
  })
  it('should disable increment button  and not call onChange when value exceeds MAX_SAFE_INTEGER and numericType is not BigInt', async () => {
    const user = userEvent.setup()
    const unsafeValue = MAX_SAFE_INTEGER + 1
    render(
      <NumberInput
        label="Test Label"
        name="Label"
        value={unsafeValue}
        step={1}
        onChange={mockOnChange}
        numericType="Float"
      />
    )
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    expect(input).toHaveFocus()
    const incrementButton = screen.getByRole('button', { name: /Increment/i })
    expect(incrementButton).toBeDisabled()
    // Verify that clicking the disabled button doesn't trigger onChange
    await user.click(incrementButton)
    expect(mockOnChange).not.toHaveBeenCalled()
  })
  it('should disable decrement button  and not call onChange when value exceeds MAX_SAFE_INTEGER and numericType is not BigInt', async () => {
    const user = userEvent.setup()
    const unsafeValue = MAX_SAFE_INTEGER + 1
    render(
      <NumberInput
        label="Test Label"
        name="Label"
        value={unsafeValue}
        step={1}
        onChange={mockOnChange}
        numericType="Int"
      />
    )
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    expect(input).toHaveFocus()
    const decrementButton = screen.getByRole('button', { name: /Decrement/i })
    expect(decrementButton).toBeDisabled()
    // Verify that clicking the disabled button doesn't trigger onChange
    await user.click(decrementButton)
    expect(mockOnChange).toHaveBeenCalledTimes(0)
  })
  describe('NumberInput differences', () => {
    it('should show value when viewMode is addition', () => {
      render(<NumberInput value={345} baseValue={1345} viewMode="addition" name="Label" />)

      const input = screen.getByTestId('number-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('345')).toBeInTheDocument()
      expect(screen.queryByText('1345')).not.toBeInTheDocument()
    })

    it('should show baseValue when viewMode is removal', () => {
      render(<NumberInput value={454} baseValue={2024} viewMode="removal" name="Label" />)

      const input = screen.getByTestId('number-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.queryByText('454')).not.toBeInTheDocument()
      expect(screen.getByText('2024')).toBeInTheDocument()
    })

    it('should show value and baseValue when viewMode is mixed', () => {
      render(<NumberInput value={878} baseValue={454} viewMode="mixed" name="Label" />)

      const input = screen.getByTestId('number-input-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('878')).toBeInTheDocument()
      expect(screen.getByText('454')).toBeInTheDocument()
    })
  })

  describe('Controlled and Uncontrolled Input Behavior', () => {
    it('should display empty input when no value is provided', () => {
      render(<NumberInput label="Test Label" name="Label" onChange={mockOnChange} />)

      const input = screen.getByRole('spinbutton')
      expect(input).toHaveValue('')
    })

    it('should display defaultValue when value is undefined', () => {
      render(<NumberInput label="Test Label" name="Label" defaultValue={100} onChange={mockOnChange} />)

      const input = screen.getByRole('spinbutton')
      expect(input).toHaveValue('100')
    })

    it('should switch between controlled and uncontrolled modes without warnings', () => {
      const { rerender } = render(<NumberInput label="Test Label" name="Label" onChange={mockOnChange} />)

      const input = screen.getByRole('spinbutton')
      expect(input).toHaveValue('')

      rerender(<NumberInput label="Test Label" name="Label" value={25} onChange={mockOnChange} />)
      expect(input).toHaveValue('25')

      rerender(<NumberInput label="Test Label" name="Label" onChange={mockOnChange} />)
      expect(input).toHaveValue('')
    })
  })
})
