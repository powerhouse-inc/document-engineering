import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { TimePicker } from './time-picker.js'
import { vi } from 'vitest'

describe('TimePicker', () => {
  beforeEach(() => {
    // Mock the timezone to be consistent across all tests
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({
            timeZone: 'America/New_York',
          }),
        }) as any
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render with basic props', () => {
    const { container } = render(
      <TimePicker label="Test Label" name="test-time" id="test-id" required disabled={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display the label when provided', () => {
    const labelText = 'Test Label'
    render(<TimePicker name="test-time" label={labelText} />)
    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('should not render the label when label prop is not provided', () => {
    render(<TimePicker name="test-time" />)
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('should mark the label as required when required prop is true', () => {
    render(<TimePicker name="test-time" label="Test Label" required />)
    const label = screen.getByText('Test Label')
    const asterisk = screen.getByText('*')
    expect(label).toBeInTheDocument()
    expect(asterisk).toBeInTheDocument()
  })

  it('should mark the label as disabled when disabled prop is true', () => {
    render(<TimePicker name="test-time" label="Test Label" disabled />)
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('cursor-not-allowed')
    expect(label).toHaveClass('text-gray-700')
  })

  it('should handle timeIntervals prop correctly with 15-minute intervals', async () => {
    const user = userEvent.setup()
    render(<TimePicker name="test-time" label="Test Label" timeIntervals={15} />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const minutes = ['00', '15', '30', '45']
    for (const minute of minutes) {
      const minuteElements = await screen.findAllByText(minute)
      expect(minuteElements.length).toBeGreaterThan(0)
      expect(minuteElements[0]).toBeInTheDocument()
    }

    ;['13', '20', '25', '35', '40', '50', '55'].forEach(minute => {
      expect(screen.queryByText(minute)).not.toBeInTheDocument()
    })
  })

  it('should handle timeIntervals prop correctly with 30-minute intervals', async () => {
    const user = userEvent.setup()
    render(<TimePicker name="test-time" label="Test Label" timeIntervals={30} />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const minutes = ['00', '30']
    for (const minute of minutes) {
      const minuteElements = await screen.findAllByText(minute)
      expect(minuteElements.length).toBeGreaterThan(0)
      expect(minuteElements[0]).toBeInTheDocument()
    }

    ;['15', '45'].forEach(minute => {
      expect(screen.queryByText(minute)).not.toBeInTheDocument()
    })
  })

  it('should handle timezone selection when timeZone prop is provided', async () => {
    const user = userEvent.setup()
    const timeZoneValue = 'America/New_York'

    render(<TimePicker name="test-time" label="Test Label" timeZone={timeZoneValue} showTimezoneSelect />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const select = await screen.findByRole('combobox')
    expect(select).toBeDisabled()

    const timezoneText = screen.getByText(content => {
      return content.includes('New York') && content.includes('(')
    })
    expect(timezoneText).toBeInTheDocument()
  })

  it('should display description when provided', () => {
    const description = 'Test description'
    render(<TimePicker name="test-time" label="Test Label" description={description} />)
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should display error messages when provided', () => {
    const errors = ['Error 1', 'Error 2']
    render(<TimePicker name="test-time" label="Test Label" errors={errors} />)
    errors.forEach(error => {
      expect(screen.getByText(error)).toBeInTheDocument()
    })
  })

  it('should display warning messages when provided', () => {
    const warnings = ['Warning 1', 'Warning 2']
    render(<TimePicker name="test-time" label="Test Label" warnings={warnings} />)
    warnings.forEach(warning => {
      expect(screen.getByText(warning)).toBeInTheDocument()
    })
  })

  it('should handle different time formats', async () => {
    const user = userEvent.setup()
    render(<TimePicker name="test-time" label="Test Label" timeFormat="HH:mm" />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    // Verify 24-hour format is used
    const hours = [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
    ]
    for (const hour of hours) {
      const hourElements = await screen.findAllByText(hour)
      expect(hourElements.length).toBeGreaterThan(0)
    }
  })

  it('should show timezone select when showTimezoneSelect is true', async () => {
    const user = userEvent.setup()
    render(<TimePicker name="test-time" label="Test Label" showTimezoneSelect />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const select = await screen.findByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).not.toBeDisabled()
  })

  it('should include continent in timezone display when includeContinent is true', async () => {
    const user = userEvent.setup()
    const timeZoneValue = 'America/New_York'

    render(
      <TimePicker name="test-time" label="Test Label" timeZone={timeZoneValue} showTimezoneSelect includeContinent />
    )

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const timezoneText = screen.getByText(content => {
      return content.includes('America') && content.includes('New York')
    })
    expect(timezoneText).toBeInTheDocument()
  })

  it('should not include continent in timezone display when includeContinent is false', async () => {
    const user = userEvent.setup()
    const timeZoneValue = 'America/New_York'

    render(
      <TimePicker
        name="test-time"
        label="Test Label"
        timeZone={timeZoneValue}
        showTimezoneSelect
        includeContinent={false}
      />
    )

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const timezoneText = screen.getByText(content => {
      return content.includes('New York') && !content.includes('America')
    })
    expect(timezoneText).toBeInTheDocument()
  })

  it('should not show timezone select when showTimezoneSelect is false', async () => {
    const user = userEvent.setup()
    // Mock the timezone to be Montevideo
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({
            timeZone: 'America/Montevideo',
          }),
          formatToParts: () => [{ type: 'timeZoneName', value: 'GMT-03:00' }],
        }) as any
    )

    render(<TimePicker name="test-time" label="Test Label" timeZone="America/Montevideo" showTimezoneSelect={false} />)

    const clockButton = screen.getByRole('button')
    await user.click(clockButton)

    const popoverContent = await screen.findByRole('dialog')
    expect(popoverContent).toBeVisible()

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).toHaveTextContent('(UTC-03) Montevideo')
  })
})
