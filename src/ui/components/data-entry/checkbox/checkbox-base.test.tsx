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
  it('should show addition state when viewMode is addition and value differs from baseValue', () => {
    render(<Checkbox viewMode="addition" value={true} baseValue={false} label="Test Label" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeInTheDocument()
  })

  it('should show removal state when viewMode is removal and value differs from baseValue', () => {
    render(<Checkbox viewMode="removal" value={false} baseValue={true} label="Test Label" />)
    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('Test Label')
    expect(checkbox).toBeInTheDocument()
    expect(label).toBeInTheDocument()
  })

  it('should not render CheckboxDiff when viewMode is edition', () => {
    render(<Checkbox viewMode="edition" value={true} label="Test Label" />)
    expect(screen.queryByTestId('checkbox-diff')).not.toBeInTheDocument()
  })
})
