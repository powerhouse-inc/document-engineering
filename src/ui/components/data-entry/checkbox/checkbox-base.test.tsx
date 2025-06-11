import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxBase } from './checkbox-base.js'
import { Checkbox } from './checkbox.js'

describe('Checkbox', () => {
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
})

describe('Checkbox Differences', () => {
  it('should render CheckboxDiff when viewMode is not edition', () => {
    render(<Checkbox viewMode="addition" value={true} label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should show green background when viewMode is addition and value differs from baseValue', () => {
    render(<Checkbox viewMode="addition" value={true} baseValue={false} label="Test Label" />)
    const container = screen.getByText('Test Label')
    expect(container).toHaveClass('bg-green-600/30')
  })

  it('should show red background when viewMode is deletion and value differs from baseValue', () => {
    render(<Checkbox viewMode="removal" value={false} baseValue={true} label="Test Label" />)
    const container = screen.getByText('Test Label')
    expect(container).toHaveClass('bg-red-600/30')
  })

  it('should not show background when value equals baseValue', () => {
    render(<Checkbox viewMode="addition" value={true} baseValue={true} label="Test Label" />)
    const container = screen.getByText('Test Label').closest('div')
    expect(container).not.toHaveClass('bg-green-100')
    expect(container).not.toHaveClass('bg-red-100')
  })

  it('should not render CheckboxDiff when viewMode is edition', () => {
    render(<Checkbox viewMode="edition" value={true} label="Test Label" />)
    expect(screen.queryByTestId('checkbox-diff')).not.toBeInTheDocument()
  })
})
