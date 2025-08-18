import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    render(
      <FileInput
        name="file"
        label="Upload File"
        description="Drop your file here or click to chose files"
        status="idle"
      />
    )
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

    expect(screen.getByText(/Supports:/)).toBeInTheDocument()
    expect(screen.getByText(/pdf/)).toBeInTheDocument()
    expect(screen.getByText(/jpg/)).toBeInTheDocument()
    expect(screen.getByText(/png/)).toBeInTheDocument()
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
  it('should call onCancel when the cancel button is clicked', () => {
    const handleCancel = vi.fn()
    render(<FileInput status="uploading" onCancel={handleCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel upload/i })
    fireEvent.click(cancelButton)

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })
  it('should call onReload when the onReload button is clicked', () => {
    const onReload = vi.fn()
    render(<FileInput status="error" onReload={onReload} />)

    const reloadButton = screen.getByRole('button', { name: /Reload upload/i })
    fireEvent.click(reloadButton)

    expect(onReload).toHaveBeenCalledTimes(1)
  })
  it('should show fileName when file is uploaded', () => {
    const handleCancel = vi.fn()
    render(
      <FileInput
        status="success"
        onCancel={handleCancel}
        fileName="example.png"
        fileSize={256000}
        description="Upload files"
        allowedFileTypes={[]}
      />
    )

    const fileNameElement = screen.getByText('example.png')
    expect(fileNameElement).toBeInTheDocument()

    const fileSizeElement = screen.getByText('256 kB')
    expect(fileSizeElement).toBeInTheDocument()
  })

  it('should reflect a "selected" state when a file is provided', () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    render(<FileInput name="file" label="Upload File" value={mockFile} />)

    const borderContainer = screen.getByTestId('file-input-border')
    expect(borderContainer).toHaveAttribute('data-state', 'selected')
  })

  it('should reflect an "idle" state when no file is provided', () => {
    render(<FileInput name="file" label="Upload File" />)

    const borderContainer = screen.getByTestId('file-input-border')
    expect(borderContainer).toHaveAttribute('data-state', 'idle')
  })

  it('should hide upload interface when status is not idle', () => {
    render(<FileInput name="file" label="Upload File" status="uploading" fileName="test.pdf" fileSize={1024} />)

    expect(screen.queryByText('Drop your file here or click to chose files')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /search file/i })).not.toBeInTheDocument()
  })

  it('should display FileUploadItem when status is uploading', () => {
    render(
      <FileInput name="file" label="Upload File" status="uploading" fileName="test.pdf" fileSize={1024} progress={50} />
    )

    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.02 kB')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should display FileUploadItem when status is success', () => {
    render(<FileInput name="file" label="Upload File" status="success" fileName="test.pdf" fileSize={1024} />)

    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.02 kB')).toBeInTheDocument()
    expect(screen.getByText('Upload successful')).toBeInTheDocument()
  })

  it('should display FileUploadItem when status is error', () => {
    render(
      <FileInput
        name="file"
        label="Upload File"
        status="error"
        fileName="test.pdf"
        fileSize={1024}
        errorsUpload={['Upload failed']}
      />
    )

    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.02 kB')).toBeInTheDocument()
    const errorMessages = screen.getAllByText('Upload failed')
    expect(errorMessages).toHaveLength(2)
  })

  it('should display Preview action when status is success and showPreview is true', () => {
    render(
      <FileInput
        name="file"
        label="Upload File"
        status="success"
        fileName="test.pdf"
        fileSize={1024}
        showPreview={true}
        preview="https://www.google.com"
      />
    )
    expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
  })
})
