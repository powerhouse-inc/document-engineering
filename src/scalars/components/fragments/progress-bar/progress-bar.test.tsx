import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './progress-bar.js'

describe('ProgressBar Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<ProgressBar value={50} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with correct data-slot attributes', () => {
    render(<ProgressBar value={50} />)
    const progressBar = screen.getByRole('progressbar')
    const indicator = progressBar.querySelector('[data-slot="progress-bar-indicator"]')

    expect(progressBar).toHaveAttribute('data-slot', 'progress-bar')
    expect(indicator).toHaveAttribute('data-slot', 'progress-bar-indicator')
  })
})
