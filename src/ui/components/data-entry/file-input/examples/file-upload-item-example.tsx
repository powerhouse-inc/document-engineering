import { useState } from 'react'
import { Form } from '../../../../../scalars/components/form/index.js'
import { FileField } from '../../../../../scalars/components/file-field/index.js'
import { Button } from '../../../../../ui/components/button/index.js'
import type { UploadFile } from '../types.js'

/**
 * Example component demonstrating the FileField component usage within a real Form context.
 * This shows how to manage file upload states and handle user interactions in a production-like scenario.
 */
const FileUploadItemExample = () => {
  const [status, setStatus] = useState<UploadFile>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string[]>([])
  const [file, setFile] = useState<File | undefined>(undefined)

  const simulateUpload = () => {
    setStatus('uploading')
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('success')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const simulateError = () => {
    setStatus('error')
    setErrorMessage(['File size exceeds limit', 'Invalid file format'])
  }

  const handleCancel = () => {
    console.log('File upload canceled')
    setStatus('idle')
    setProgress(0)
    setErrorMessage([])
  }

  const handleReload = () => {
    console.log('Retrying upload')
    setStatus('uploading')
    setProgress(0)
    setErrorMessage([])
    simulateUpload()
  }

  const resetToIdle = () => {
    setStatus('idle')
    setProgress(0)
    setErrorMessage([])
  }

  const handleFormSubmit = async (data: { file: File; description: string }) => {
    const file = data.file
    setFile(file)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // eslint-disable-next-line no-alert
    alert(`Form submitted successfully!\n\nFile: ${data.file.name}\nDescription: ${data.description}`)
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">FileField Integration Example</h3>
        <p className="text-sm text-gray-600">
          This example demonstrates how to use FileField within a real Form context, showing file upload states and user
          interactions in a production-like scenario.
        </p>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h4 className="text-md font-medium text-gray-700 mb-4">Document Upload Form</h4>

          <Form onSubmit={handleFormSubmit}>
            {({ formState: { isSubmitting } }) => (
              <div className="space-y-4 w-[247px]">
                <FileField
                  name="file"
                  label="Upload Document"
                  description="Choose your document"
                  required
                  allowedFileTypes={[
                    'image/png',
                    'image/jpg',
                    'image/jpeg',
                    'application/pdf',
                    'text/plain',
                    'application/epub+zip',
                  ]}
                  maxFileSize={15728640}
                  dragAndDropEnabled={true}
                  // File upload state props
                  status={status}
                  progress={progress}
                  showPreview={true}
                  errorsUpload={errorMessage}
                  onCancel={handleCancel}
                  onReload={handleReload}
                  fileName={file?.name ?? ''}
                  fileSize={file?.size ?? 0}
                  mimeType={file?.type ?? ''}
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={simulateUpload}
                    disabled={status === 'uploading'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Simulate Upload
                  </button>
                  <button
                    type="button"
                    onClick={simulateError}
                    disabled={status === 'uploading'}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Simulate Error
                  </button>
                  <button
                    type="button"
                    onClick={resetToIdle}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                  >
                    Reset to Idle
                  </button>
                </div>

                {/* Form Submit Button */}
                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit Document'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <h4 className="font-medium text-gray-700">How to use this example:</h4>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>Select a file using the FileField component in the form above</li>
          <li>Use the control buttons to simulate different upload states</li>
          <li>Submit the form to see how FileField integrates with form submission</li>
          <li>Observe how the FileUploadItem component responds to different props</li>
          <li>Try the cancel and reload functionality</li>
        </ol>
      </div>
    </div>
  )
}

export default FileUploadItemExample
