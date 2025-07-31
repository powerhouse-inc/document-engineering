import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FileInput } from './file-input.js'

describe('FileInput Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<FileInput name="file" label="Upload File" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render with label', () => {
    render(<FileInput name="file" label="Upload File" />)
    expect(screen.getByText('Upload File')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<FileInput name="file" label="Upload File" description="Drop your file here or click to chose files" />)
    expect(screen.getByText('Drop your file here or click to chose files')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<FileInput name="file" label="Upload File" disabled />)
    expect(screen.getByLabelText('Upload File')).toBeDisabled()
  })

  it('should display erros messages', () => {
    render(<FileInput name="file" label="Upload File" errors={['Invalid file']} />)
    expect(screen.getByText('Invalid file')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', async () => {
    render(<FileInput name="file" label="Upload File" required errors={['Invalid file']} />)

    const input = screen.getByLabelText(/Upload File/)
    expect(input).toHaveAttribute('aria-required', 'true')
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should accept allowedFileTypes prop', () => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    render(<FileInput name="file" label="Upload File" allowedFileTypes={allowedTypes} />)

    expect(screen.getByText('Supports: pdf, jpg, png')).toBeInTheDocument()
  })

  it('should accept maxFileSize prop', () => {
    render(<FileInput name="file" label="Upload File" maxFileSize={10485760} />)

    expect(screen.getByText('Max: 10.49 MB')).toBeInTheDocument()
  })

  it('should disable drag and drop when dragAndDropEnabled is false', () => {
    render(<FileInput name="file" label="Upload File" dragAndDropEnabled={false} />)

    const dropArea = screen.getByTestId('file-drop-area')
    expect(dropArea).toHaveClass('pointer-events-none')
    expect(dropArea).toHaveClass('cursor-not-allowed')
  })
})
