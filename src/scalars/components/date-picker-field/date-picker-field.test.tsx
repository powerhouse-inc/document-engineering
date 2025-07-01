import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithForm } from '../../lib/testing.js'
import { DatePickerField } from './date-picker-field.js'
import { addDays, format } from 'date-fns'

// Helper function to get a date relative to today
export const getRelativeDate = (daysFromToday: number) => {
  const date = addDays(new Date(), daysFromToday)
  return format(date, 'yyyy-MM-dd')
}

describe('DatePickerField', () => {
  const fixedDate = new Date('2025-01-01T12:00:00Z')

  beforeEach(() => {
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  const defaultProps = {
    name: 'test-date',
    label: 'Test Label',
  }
  it('should mock the system date to fixedDate', () => {
    const now = new Date()
    expect(now.toISOString()).toBe(fixedDate.toISOString())
  })
  it('should match the snapshot', () => {
    const { container } = renderWithForm(
      <DatePickerField {...defaultProps} value="2025-01-01" dateFormat="yyyy-MM-dd" />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display the label when provided', () => {
    renderWithForm(<DatePickerField {...defaultProps} />)
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
  })

  it('should not render the label when label prop is not provided', () => {
    renderWithForm(<DatePickerField name="test-date" />)
    expect(screen.queryByText(defaultProps.label)).not.toBeInTheDocument()
  })

  it('should mark the label as required when required prop is true', () => {
    renderWithForm(<DatePickerField {...defaultProps} required />)
    const label = screen.getByText(defaultProps.label)
    const asterisk = screen.getByText('*')
    expect(label).toBeInTheDocument()
    expect(asterisk).toBeInTheDocument()
  })

  it('should mark the label as disabled when disabled prop is true', () => {
    renderWithForm(<DatePickerField {...defaultProps} disabled />)
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveClass('cursor-not-allowed')
    expect(label).toHaveClass('text-gray-700')
  })

  it('should disable dates before minDate', async () => {
    // Arrange: Get dates relative to today
    const minDate = getRelativeDate(5) // 5 days from today
    renderWithForm(<DatePickerField {...defaultProps} minDate={minDate} />)

    // Act: Open calendar
    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)

    // Assert: Calendar is visible
    const calendar = await screen.findByRole('dialog')
    expect(calendar).toBeInTheDocument()

    // Assert: Date before minDate is disabled
    const dateButton = screen.getByRole('button', {
      name: format(addDays(new Date(), 2), 'EEEE, MMMM do, yyyy'),
    })
    expect(dateButton).toHaveClass('disabled:pointer-events-none')
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('should disable dates after maxDate', async () => {
    // Arrange: Get dates relative to today
    const maxDate = getRelativeDate(5) // 5 days from today
    renderWithForm(<DatePickerField {...defaultProps} maxDate={maxDate} />)

    // Act: Open calendar
    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)

    // Assert: Calendar is visible
    const calendar = await screen.findByRole('dialog')
    expect(calendar).toBeInTheDocument()

    // Assert: Date after maxDate is disabled
    const dateButton = screen.getByRole('button', {
      name: format(addDays(new Date(), 7), 'EEEE, MMMM do, yyyy'),
    })
    expect(dateButton).toHaveClass('disabled:pointer-events-none')
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('should show error when date is before minDate', async () => {
    // Arrange: Get dates relative to today
    const minDate = getRelativeDate(5)
    renderWithForm(<DatePickerField {...defaultProps} minDate={minDate} showErrorOnBlur />)

    // Act: Type invalid date and blur
    const input = screen.getByRole('textbox')
    await userEvent.type(input, getRelativeDate(2))
    await userEvent.tab()

    // Assert: Error message is shown
    expect(screen.getByText(/Date must be after/i)).toBeInTheDocument()
  })

  it('should show error when date is after maxDate', async () => {
    // Arrange: Get dates relative to today
    const maxDate = getRelativeDate(5)
    renderWithForm(<DatePickerField {...defaultProps} maxDate={maxDate} showErrorOnBlur />)

    // Act: Type invalid date and blur
    const input = screen.getByRole('textbox')
    await userEvent.type(input, getRelativeDate(7))
    await userEvent.tab()

    // Assert: Error message is shown
    expect(screen.getByText(/Date must be before/i)).toBeInTheDocument()
  })

  it('should show error when its valid for(YYYY) and format its undefined', async () => {
    renderWithForm(<DatePickerField {...defaultProps} showErrorOnBlur />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, '3455')
    await userEvent.tab()
    expect(screen.getByText(/Invalid date format. Please use a valid format/i)).toBeInTheDocument()
  })
})
