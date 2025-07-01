import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithForm } from '../../lib/testing.js'
import { BooleanField } from './boolean-field.js'

describe('BooleanField Component', () => {
  const commonProps = {
    label: 'Test Field',
    description: 'Test description',
    value: true,
    required: true,
    disabled: false,
    errors: ['Test error'],
    warnings: ['Test warning'],
    className: 'test-class',
    onChange: vi.fn(),
  }

  it('should match snapshot', () => {
    const { container } = renderWithForm(<BooleanField {...commonProps} name="test" />)
    expect(container).toMatchSnapshot()
  })

  it('should render toggle field when isToggle is true', () => {
    renderWithForm(<BooleanField name="test" {...commonProps} isToggle={true} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('should render checkbox field when isToggle is false', () => {
    renderWithForm(<BooleanField name="test" {...commonProps} isToggle={false} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('should pass all props to ToggleField when isToggle is true', () => {
    const { getByRole, queryByText } = renderWithForm(<BooleanField name="test" {...commonProps} isToggle={true} />)
    const toggle = getByRole('switch')
    expect(toggle).toBeChecked()
    expect(toggle).toBeEnabled()
    const toggleLabel = queryByText('Test Field')
    expect(toggleLabel).toHaveAttribute('for', toggle.id)
  })

  it('should pass all props to CheckboxField when isToggle is false', () => {
    const { getByRole, getByText } = renderWithForm(<BooleanField name="test" {...commonProps} isToggle={false} />)
    const checkbox = getByRole('checkbox')
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeEnabled()
    const checkboxLabel = getByText('Test Field')
    expect(checkboxLabel).toHaveAttribute('for', checkbox.id)
  })

  it('should submit toggle value correctly on form submission', async () => {
    const mockOnSubmit = vi.fn()
    const user = userEvent.setup()

    const { getByRole, getByText } = renderWithForm(
      <>
        <BooleanField name="test" label="Test Toggle" isToggle={true} value={true} />
        <button type="submit">Submit</button>
      </>,
      mockOnSubmit
    )

    const toggle = getByRole('switch')

    await user.click(getByText('Submit'))
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ test: true })
    })

    mockOnSubmit.mockClear()

    await user.click(toggle)
    await user.click(getByText('Submit'))
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ test: false })
    })
  })

  it('should submit checkbox value correctly on form submission', async () => {
    const mockOnSubmit = vi.fn()
    const user = userEvent.setup()

    const { getByRole, getByText } = renderWithForm(
      <>
        <BooleanField name="test" label="Test Checkbox" isToggle={false} value={false} />
        <button type="submit">Submit</button>
      </>,
      mockOnSubmit
    )

    const checkbox = getByRole('checkbox')

    await user.click(getByText('Submit'))
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ test: false })
    })

    mockOnSubmit.mockClear()

    await user.click(checkbox)
    await user.click(getByText('Submit'))
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ test: true })
    })
  })
})
