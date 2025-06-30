import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './date-picker'
import { addDays, format } from 'date-fns'

// Helper function to get a date relative to today
export const getRelativeDate = (daysFromToday: number) => {
  const date = addDays(new Date(), daysFromToday)
  return format(date, 'yyyy-MM-dd')
}

const fixedDate = new Date('2025-01-01T12:00:00Z')

beforeEach(() => {
  vi.setSystemTime(fixedDate)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('DatePicker', () => {
  const defaultProps = {
    name: 'test-date',
    label: 'Test Date',
  }
  it('should mock the system date to fixedDate', () => {
    const now = new Date()
    expect(now.toISOString()).toBe(fixedDate.toISOString())
  })

  it('should match the snapshot', () => {
    const { container } = render(
      <DatePicker label="Test Label" name="test-date" value="2025-01-01" dateFormat="yyyy-MM-dd" />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display the label when provided', () => {
    const labelText = 'Test Label'
    render(<DatePicker name="test-date" label={labelText} />)
    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('should render with label', () => {
    render(<DatePicker {...defaultProps} />)
    expect(screen.getByText('Test Date')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should show description when provided', () => {
    const description = 'This is a test description'
    render(<DatePicker {...defaultProps} description={description} />)
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should show error messages when provided', () => {
    const errors = ['Invalid date format']
    render(<DatePicker {...defaultProps} errors={errors} />)
    expect(screen.getByText('Invalid date format')).toBeInTheDocument()
  })

  it('should show warning messages when provided', () => {
    const warnings = ['Date is in the past']
    render(<DatePicker {...defaultProps} warnings={warnings} />)
    expect(screen.getByText('Date is in the past')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<DatePicker {...defaultProps} disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should disable dates before minDate', async () => {
    // Arrange: Get dates relative to today
    const minDate = getRelativeDate(5) // 5 days from today
    render(<DatePicker label="Test Label" name="test-date" minDate={minDate} />)

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
  })

  it('should disable dates after maxDate', async () => {
    // Arrange: Get dates relative to today
    const maxDate = getRelativeDate(5) // 5 days from today

    render(<DatePicker label="Test Label" name="test-date" maxDate={maxDate} />)

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

  it('should handle custom date format', async () => {
    // Arrange: Render component with custom date format
    const dateFormat = 'DD/MM/YYYY'

    render(<DatePicker {...defaultProps} dateFormat={dateFormat} />)

    // Act: Open calendar and select date
    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)
    const dateButton = screen.getByRole('button', {
      name: format(addDays(new Date(), 3), 'EEEE, MMMM do, yyyy'),
    })
    await userEvent.click(dateButton)

    // Assert: Input value matches custom format
    const input: HTMLInputElement = screen.getByRole('textbox')
    await waitFor(() => {
      expect(input.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })
  })

  it('should close calendar when clicking outside', async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />)

    // Act: Open calendar and click outside
    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)
    await userEvent.click(document.body)

    // Assert: Calendar is closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should handle manual date input', async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />)
    const input: HTMLInputElement = screen.getByRole('textbox')

    // Act: Type date manually
    const testDate = getRelativeDate(3)
    await userEvent.type(input, testDate)

    // Assert: Input has correct value
    expect(input.value).toBe(testDate)
  })

  it('should open calendar when clicking the input', async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />)

    // Act: Click calendar button
    const calendarButton = screen.getByTestId('icon-fallback').closest('button')
    await userEvent.click(calendarButton!)

    // Assert: Calendar is visible with grid
    const calendar = await screen.findByRole('dialog')
    expect(calendar).toBeInTheDocument()
    expect(screen.getByRole('grid')).toBeInTheDocument()

    // Act: Click outside
    await userEvent.click(document.body)

    // Assert: Calendar is closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should handle autoClose prop', async () => {
    // Arrange: Render component with autoClose
    render(<DatePicker {...defaultProps} autoClose />)

    // Act: Open calendar and select date
    const calendarButton = screen.getByTestId('icon-fallback').closest('button')
    await userEvent.click(calendarButton!)

    const newDate = new Date(fixedDate)
    // We Get next day of the mockDate (fixedDate) that will always be in the calendar
    newDate.setDate(newDate.getDate() + 1)
    // We format the date to the expected format
    const dateButton = screen.getByRole('button', {
      name: format(newDate, 'EEEE, MMMM do, yyyy'),
    })
    await userEvent.click(dateButton)

    // Assert: Calendar closes automatically
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should handle weekStart prop', async () => {
    // Arrange: Render component with weekStart
    render(<DatePicker {...defaultProps} weekStart="Monday" />)

    // Act: Open calendar
    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)

    // Assert: Weekday headers are in correct order
    const weekdayHeaders = screen.getAllByRole('columnheader', { hidden: true })
    const weekdays = weekdayHeaders.map((header) => header.textContent)
    expect(weekdays).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])
  })
  describe('DateInputDiff differences', () => {
    it('should render DateInputDiff when viewMode is addition', () => {
      render(
        <DatePicker
          {...defaultProps}
          viewMode="addition"
          value={new Date('2025-10-11T12:00:00.000Z')}
          baseValue={new Date('2024-10-22T12:00:00.000Z')}
          dateFormat="YYYY-MM-DD"
        />
      )
      expect(screen.getByTestId('date-picker-diff')).toBeInTheDocument()
      expect(screen.getByTestId('icon-fallback')).toBeInTheDocument()
      expect(screen.getByText('2025-10-11')).toBeInTheDocument()
      expect(screen.queryByText('2024-10-22')).not.toBeInTheDocument()
    })

    it('should render DateInputDiff when viewMode is removal', () => {
      render(
        <DatePicker
          {...defaultProps}
          viewMode="removal"
          value={new Date('2025-02-11T12:00:00.000Z')}
          baseValue={new Date('2024-10-22T12:00:00.000Z')}
          dateFormat="YYYY-MM-DD"
        />
      )
      expect(screen.getByTestId('date-picker-diff')).toBeInTheDocument()
      expect(screen.getByTestId('icon-fallback')).toBeInTheDocument()
      expect(screen.queryByText('2025-02-11')).not.toBeInTheDocument()
      expect(screen.getByText('2024-10-22')).toBeInTheDocument()
    })

    it('should render DateInputDiff when viewMode is mixed', () => {
      render(
        <DatePicker
          {...defaultProps}
          viewMode="mixed"
          value={new Date('2025-01-01T12:00:00.000Z')}
          baseValue={new Date('2024-01-01T12:00:00.000Z')}
        />
      )
      expect(screen.getByTestId('date-picker-diff')).toBeInTheDocument()
      const iconFallbacks = screen.getAllByTestId('icon-fallback')
      expect(iconFallbacks).toHaveLength(2)
      expect(screen.getByText('2024-01-01')).toBeInTheDocument()
      expect(screen.getByText('2025-01-01')).toBeInTheDocument()
    })

    it('should not render DateInputDiff when viewMode is edition', () => {
      render(<DatePicker {...defaultProps} viewMode="edition" value="2025-01-01" />)
      expect(screen.queryByTestId('date-picker-diff')).not.toBeInTheDocument()
    })
  })
  it('should show year only years when format is YYYY', async () => {
    const date = new Date()
    const year = date.getFullYear().toString()
    render(<DatePicker {...defaultProps} dateFormat="YYYY" />)

    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)

    expect(screen.getAllByText(year)).toHaveLength(2)
    expect(screen.queryByText('January')).not.toBeInTheDocument()
  })
  it('should show year and month only when format is YYYY-MM', async () => {
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.toLocaleString('en-US', { month: 'long' })

    render(<DatePicker {...defaultProps} dateFormat="YYYY-MM" />)

    const calendarTrigger = screen.getByTestId('icon-fallback')
    await userEvent.click(calendarTrigger)

    expect(screen.getAllByText(year)).toHaveLength(2)
    expect(screen.getByText(month)).toBeInTheDocument()
  })
})
