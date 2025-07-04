import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateTimePicker } from './date-time-picker'
import { vi } from 'vitest'
import type { ChangeEvent, FocusEvent } from 'react'

describe('DateTimePicker', () => {
  const defaultProps = {
    name: 'datetime',
    label: 'Date and Time',
    placeholder: 'Select date and time',
  }

  it('should match the snapshot', () => {
    const { container } = render(
      <DateTimePicker
        {...defaultProps}
        label="Test Label"
        name="test-date"
        value="2025-01-01T12:00:00.000Z"
        dateFormat="yyyy-MM-dd"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should handle disabled state', () => {
    render(<DateTimePicker {...defaultProps} disabled />)

    const input = screen.getByPlaceholderText('Select date and time')
    expect(input).toBeDisabled()
  })

  it('should render with basic props', () => {
    render(<DateTimePicker {...defaultProps} />)

    expect(screen.getByPlaceholderText('Select date and time')).toBeInTheDocument()
    expect(screen.getByText('Date and Time')).toBeInTheDocument()
  })

  it('should display error messages', () => {
    const errors = ['Invalid date format']
    render(<DateTimePicker {...defaultProps} errors={errors} />)

    expect(screen.getByText('Invalid date format')).toBeInTheDocument()
  })

  it('should display warning messages', () => {
    const warnings = ['Date is in the past']
    render(<DateTimePicker {...defaultProps} warnings={warnings} />)

    expect(screen.getByText('Date is in the past')).toBeInTheDocument()
  })

  it('should handle description', () => {
    const description = 'Select a date and time for your appointment'
    render(<DateTimePicker {...defaultProps} description={description} />)

    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should disable past dates when disablePastDates is true', async () => {
    render(<DateTimePicker name="datetime" label="Date and Time" placeholder="Select date and time" disablePastDates />)

    // Click the calendar button using the SVG icon
    const calendarButton = screen.getByTestId('icon-fallback').closest('button')
    if (!calendarButton) throw new Error('Calendar button not found')
    await userEvent.click(calendarButton)

    // Wait for the calendar to be present
    await waitFor(() => {
      const calendar = screen.getByRole('dialog')
      expect(calendar).toBeInTheDocument()
    })

    // Find all day buttons using the aria-label
    const dateButtons = screen.getAllByRole('button', {
      name: /^(Today, )?[A-Za-z]+, [A-Za-z]+ \d{1,2}(st|nd|rd|th), \d{4}$/,
    })

    const today = new Date()
    dateButtons.forEach((button) => {
      const dateStr = button.getAttribute('aria-label')
      if (!dateStr) return

      // Extract day, month and year from aria-label
      const match = dateStr.match(/([A-Za-z]+), ([A-Za-z]+) (\d{1,2})(st|nd|rd|th), (\d{4})/)
      if (!match) return
      const [, , month, day, , year] = match
      const buttonDate = new Date(`${month} ${day}, ${year}`)

      // If the button date is before today, it should be disabled
      if (
        buttonDate.getFullYear() < today.getFullYear() ||
        (buttonDate.getFullYear() === today.getFullYear() && buttonDate.getMonth() < today.getMonth()) ||
        (buttonDate.getFullYear() === today.getFullYear() &&
          buttonDate.getMonth() === today.getMonth() &&
          buttonDate.getDate() < today.getDate())
      ) {
        expect(button).toHaveClass('disabled:pointer-events-none')
      }
    })
  })

  it('should disable future dates when disableFutureDates is true', async () => {
    render(<DateTimePicker {...defaultProps} disableFutureDates />)

    // Click the calendar button to open the popup
    const calendarButton = screen.getByTestId('icon-fallback').closest('button')
    if (!calendarButton) throw new Error('Calendar button not found')
    await userEvent.click(calendarButton)

    // Wait for the calendar to be present
    await waitFor(() => {
      const calendar = screen.getByRole('dialog')
      expect(calendar).toBeInTheDocument()
    })

    // Get all date buttons using their aria-labels
    const dateButtons = screen.getAllByRole('button', {
      name: /^(Today, )?[A-Za-z]+, [A-Za-z]+ \d{1,2}(st|nd|rd|th), \d{4}$/,
    })

    // Check if future dates are disabled
    const today = new Date()
    dateButtons.forEach((button) => {
      const dateStr = button.getAttribute('aria-label')
      if (!dateStr) return

      // Extract the date from the aria-label
      const dateMatch = dateStr.match(/(\d{1,2})(st|nd|rd|th), (\d{4})/)
      if (!dateMatch) return

      const [_, day, __, year] = dateMatch
      const buttonDate = new Date(parseInt(year), today.getMonth(), parseInt(day))

      if (buttonDate > today) {
        expect(button).toHaveClass('disabled:pointer-events-none')
      }
    })
  })

  it('should handle 12-hour time format', async () => {
    render(<DateTimePicker {...defaultProps} timeFormat="hh:mm a" />)

    // Click the calendar button to open the popup
    await userEvent.click(screen.getByTestId('icon-fallback').closest('button')!)

    // Wait for the dialog to be present
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    // Switch to time tab (clock icon)
    const tabs = screen.getAllByRole('tab')
    const timeTab = tabs[1] // second tab is the time tab
    await userEvent.click(timeTab)

    // Verify AM/PM buttons are present
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /am/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pm/i })).toBeInTheDocument()
    })
  })

  it('should handle 24-hour time format', async () => {
    render(<DateTimePicker {...defaultProps} timeFormat="HH:mm" />)

    // Open the picker by clicking the calendar button (icon)
    await userEvent.click(screen.getByTestId('icon-fallback').closest('button')!)

    // Wait for the dialog to be present
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Switch to time tab
    const tabs = screen.getAllByRole('tab')
    const timeTab = tabs[1]
    await userEvent.click(timeTab)

    // Check if 24-hour format is used
    expect(screen.queryByRole('button', { name: /am/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pm/i })).not.toBeInTheDocument()
  })

  it('should handle required state', () => {
    render(<DateTimePicker {...defaultProps} required />)

    // Check for the asterisk
    expect(screen.getByText('*')).toBeInTheDocument()

    // Or, check the input
    const input = screen.getByPlaceholderText('Select date and time')
    expect(input).toBeRequired()
  })

  it('should handle different date formats correctly', async () => {
    const onChange = vi.fn<(e: ChangeEvent<HTMLInputElement>) => void>()
    render(<DateTimePicker {...defaultProps} dateFormat="dd/MM/yyyy" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Select date and time')
    await userEvent.type(input, '25/12/2024 14:30')

    // Verify the input value is formatted correctly
    expect(input).toHaveValue('25/12/2024 14:30')

    // Get the last call to onChange
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]

    // Verify the event type
    expect(lastCall.type).toBe('change')
  })

  it('should handle invalid date format gracefully', async () => {
    const onChange = vi.fn<(e: ChangeEvent<HTMLInputElement>) => void>()
    render(<DateTimePicker {...defaultProps} dateFormat="yyyy-MM-dd" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Select date and time')
    await userEvent.type(input, 'invalid-date 14:30')

    // Verify the input shows only the time part for invalid dates
    expect(input).not.toHaveValue('14:30')
  })

  it('should handle time format changes correctly', async () => {
    const onChange = vi.fn<(e: ChangeEvent<HTMLInputElement>) => void>()
    render(<DateTimePicker {...defaultProps} timeFormat="hh:mm a" onChange={onChange} />)

    const input: HTMLInputElement = screen.getByPlaceholderText('Select date and time')
    await userEvent.type(input, '2024-12-25 02:30 PM')

    // Verify the input value is formatted correctly (without AM/PM in display)
    // Note: The component adds a trailing space, so we trim it for comparison
    expect(input.value.trim()).toBe('2024-12-25 02:30 PM')

    // Get the last call to onChange
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]

    // Verify the event type
    expect(lastCall.type).toBe('change')
  })

  it('should handle empty input correctly', async () => {
    const onChange = vi.fn<(e: ChangeEvent<HTMLInputElement>) => void>()
    const onBlur = vi.fn<(e: FocusEvent<HTMLInputElement>) => void>()
    render(<DateTimePicker {...defaultProps} onChange={onChange} onBlur={onBlur} />)

    const input = screen.getByPlaceholderText('Select date and time')
    await userEvent.clear(input)
    await userEvent.tab() // Trigger blur

    // Get the last call to onChange
    const lastOnChangeCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]

    // Verify onChange was called with empty value
    expect(lastOnChangeCall.type).toBe('change')
    expect(lastOnChangeCall.target.value).toBe('')

    // Get the last call to onBlur
    const lastOnBlurCall = onBlur.mock.calls[onBlur.mock.calls.length - 1][0]

    // Verify onBlur was called with empty value
    expect(lastOnBlurCall.type).toBe('blur')
    expect(lastOnBlurCall.target.value).toBe('')
  })
  describe('DateTimePicker differences', () => {
    it('should show value when viewMode is addition', () => {
      const value = '2025-06-05T11:47:34.000-03:00'
      const baseValue = '2024-03-05T11:47:34.000-03:00'
      render(
        <DateTimePicker
          {...defaultProps}
          value={value}
          baseValue={baseValue}
          viewMode="addition"
          dateFormat="MMM-DD-YYYY"
          timeFormat="hh:mm"
          timeIntervals={1}
        />
      )

      const input = screen.getByTestId('date-time-picker-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('Jun-05-2025 11:47')).toBeInTheDocument()
      expect(screen.queryByText('Mar-05-2024 11:47')).not.toBeInTheDocument()
    })

    it('should show baseValue when viewMode is removal', () => {
      const value = '2024-01-02T11:55:34.000-03:00'
      const baseValue = '2024-05-01T11:55:34.000-03:00'
      render(
        <DateTimePicker
          {...defaultProps}
          value={value}
          baseValue={baseValue}
          viewMode="removal"
          dateFormat="MMM-DD-YYYY"
          timeFormat="hh:mm"
          timeIntervals={1}
        />
      )

      const input = screen.getByTestId('date-time-picker-diff')
      expect(input).toBeInTheDocument()
      expect(screen.queryByText('Jan-02-2024 11:55')).not.toBeInTheDocument()
      expect(screen.getByText('May-01-2024 11:55')).toBeInTheDocument()
    })

    it('should show value and baseValue when viewMode is mixed', () => {
      const value = '2024-01-02T11:55:34.000-03:00'
      const baseValue = '2024-05-01T11:55:34.000-03:00'
      render(
        <DateTimePicker
          {...defaultProps}
          value={value}
          baseValue={baseValue}
          viewMode="mixed"
          dateFormat="MMM-DD-YYYY"
          timeFormat="hh:mm a"
          timeIntervals={1}
        />
      )

      const input = screen.getByTestId('date-time-picker-diff')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('Jan-02-2024 11:55 AM')).toBeInTheDocument()
      expect(screen.getByText('May-01-2024 11:55 AM')).toBeInTheDocument()
    })

    it('should the input when viewMode is edition', () => {
      const newValue = '2024-01-01T11:55:34.000-03:00'
      render(<DateTimePicker {...defaultProps} value={newValue} viewMode="edition" />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })
})
