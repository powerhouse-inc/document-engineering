import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { renderWithForm } from '../../../lib/testing.js'
import { ToggleField } from './toggle-field.js'

describe('ToggleField Component', () => {
  const mockOnChange = vi.fn()

  it('should match snapshot', () => {
    const { container } = renderWithForm(<ToggleField name="test" label="Test Label" />)
    expect(container).toMatchSnapshot()
  })

  it('should render default status without label', () => {
    renderWithForm(<ToggleField name="test" />)
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('should render with label when label prop is provided', () => {
    renderWithForm(<ToggleField name="test" label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render checked status without label', () => {
    renderWithForm(<ToggleField name="test" value={true} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('data-state', 'checked')
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('should render unchecked status with label', () => {
    renderWithForm(<ToggleField name="test" label="Test Label" value={false} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should display an error message when errors prop is provided', async () => {
    renderWithForm(<ToggleField name="test" label="Test Label" errors={['Error message']} />)
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })
  })

  it('should call onChange when clicked', () => {
    renderWithForm(<ToggleField name="test" label="Test Label" onChange={mockOnChange} />)
    const toggleInput = screen.getByRole('switch')

    fireEvent.click(toggleInput)
    expect(toggleInput).toBeInTheDocument()
    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('should disable the toggle when disabled prop is true', () => {
    renderWithForm(<ToggleField name="test" disabled />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toBeDisabled()
  })

  it('should render with custom className', () => {
    renderWithForm(<ToggleField name="test" className="custom-class" />)
    const toggle = screen.getByTestId('custom-class')
    expect(toggle).toHaveClass('custom-class')
  })
})
