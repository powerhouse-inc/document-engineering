import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxBase } from './checkbox-base.js'
import { Checkbox } from './checkbox.js'

describe('Checkbox Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<CheckboxBase name="test" />)
    expect(container).toMatchSnapshot()
  })

  it('should render a checkbox', () => {
    render(<CheckboxBase />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should handle checked state', () => {
    const handleCheckedChange = vi.fn()
    render(<CheckboxBase onCheckedChange={handleCheckedChange} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<CheckboxBase disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('should be focusable with tab navigation', async () => {
    const user = userEvent.setup()
    render(<CheckboxBase />)

    const checkbox = screen.getByRole('checkbox')
    await user.tab()

    expect(checkbox).toHaveFocus()
  })

  it('should have aria-required attribute when required', () => {
    render(<CheckboxBase required />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
  })
})

describe('Checkbox differences', () => {
  it('should show CheckboxDiff when viewMode is addition', () => {
    render(<Checkbox viewMode="addition" value={true} baseValue={false} label="Checkbox" />)

    expect(screen.getByTestId('checkbox-diff')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByText('Checkbox')).toBeInTheDocument()
  })
  it('should show CheckboxDiff when viewMode is removal', () => {
    render(<Checkbox viewMode="removal" value={false} baseValue={true} label="Checkbox" />)

    expect(screen.getByTestId('checkbox-diff')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByText('Checkbox')).toBeInTheDocument()
  })
  it('should not render CheckboxDiff when viewMode is edition', () => {
    render(<Checkbox viewMode="edition" value={true} label="Checkbox" />)
    expect(screen.queryByTestId('checkbox-diff')).not.toBeInTheDocument()
  })
})
