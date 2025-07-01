import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { ToggleBase } from './toggle-base.js'
import { Toggle } from './toggle.js'

describe('Toggle Component', () => {
  const defaultProps = {
    onChange: vi.fn(),
    disabled: false,
    checked: false,
    required: false,
  }

  describe('Testing the interactive behavior of the Toggle component', () => {
    it('should match snapshot', () => {
      const { container } = render(<ToggleBase {...defaultProps} />)
      expect(container).toMatchSnapshot()
    })

    it('should call onChange with correct value when clicked', () => {
      const handleChange = vi.fn()
      render(<ToggleBase {...defaultProps} onChange={handleChange} />)

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should not call onChange when disabled', () => {
      const handleChange = vi.fn()
      render(<ToggleBase {...defaultProps} disabled={true} onChange={handleChange} />)

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should toggle between checked and unchecked states', () => {
      const handleChange = vi.fn()
      const { rerender } = render(<ToggleBase {...defaultProps} checked={false} onChange={handleChange} />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-state', 'unchecked')

      fireEvent.click(toggle)
      rerender(<ToggleBase {...defaultProps} checked={true} onChange={handleChange} />)

      expect(toggle).toHaveAttribute('data-state', 'checked')
    })

    it('should be focusable with tab navigation', async () => {
      const user = userEvent.setup()
      render(<ToggleBase {...defaultProps} />)
      const toggle = screen.getByRole('switch')

      await user.tab()
      expect(toggle).toHaveFocus()
    })
  })

  describe('Testing rendering characteristics of the Toggle component', () => {
    it('should render with correct initial checked state', () => {
      render(<ToggleBase {...defaultProps} checked={true} />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-state', 'checked')
    })

    it('should render as unchecked when checked prop is false', () => {
      render(<ToggleBase {...defaultProps} checked={false} />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-state', 'unchecked')
    })

    it('should have disabled attribute when disabled', () => {
      render(<ToggleBase {...defaultProps} disabled />)
      const toggle = screen.getByRole('switch')

      expect(toggle).toHaveAttribute('disabled')
    })

    it('should have aria-required attribute when required', () => {
      render(<ToggleBase {...defaultProps} required />)
      const toggle = screen.getByRole('switch')

      expect(toggle).toHaveAttribute('aria-required', 'true')
    })

    it('should apply custom className when provided', () => {
      const customClass = 'custom-class'
      render(<ToggleBase {...defaultProps} className={customClass} />)
      const toggle = screen.getByRole('switch')

      expect(toggle).toHaveClass(customClass)
    })
  })

  describe('Toggle differences', () => {
    it('should show ToggleDiff when viewMode is addition', () => {
      render(<Toggle viewMode="addition" value={true} baseValue={false} label="Toggle" />)

      expect(screen.getByTestId('toggle-diff')).toBeInTheDocument()
      expect(screen.getByRole('switch')).toBeChecked()
      expect(screen.getByText('Toggle')).toBeInTheDocument()
    })
    it('should show ToggleDiff when viewMode is removal', () => {
      render(<Toggle viewMode="removal" value={false} baseValue={true} label="Toggle" />)

      expect(screen.getByTestId('toggle-diff')).toBeInTheDocument()
      expect(screen.getByRole('switch')).not.toBeChecked()
      expect(screen.getByText('Toggle')).toBeInTheDocument()
    })
    it('should not render ToggleDiff when viewMode is edition', () => {
      render(<Toggle viewMode="edition" value={true} label="Toggle" />)
      expect(screen.queryByTestId('toggle-diff')).not.toBeInTheDocument()
    })
  })
})
