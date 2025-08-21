import type { Meta, StoryObj } from '@storybook/react'
import FileUploadItemExample from './file-upload-item-example.js'

const meta = {
  title: 'Data Entry/File Input/Examples/File Upload Item Example',
  component: FileUploadItemExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        code: `
import { useState } from 'react'
import { FileUploadItem } from '../sub-components/file-upload-item.js'
import type { UploadFile } from '../types.js'

const FileUploadItemExample = () => {
  const [status, setStatus] = useState<UploadFile>('idle')
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<{
    name: string
    size: number
    type: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      })
      setStatus('idle')
      setProgress(0)
      setErrorMessage([])
    }
  }

  const simulateUpload = () => {
    if (!file) return
    
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
    setFile(null)
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

  return (
    <div className="space-y-6 p-6 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">File Upload Item Examples</h3>
        
        {/* File Selection */}
        <div className="space-y-2">
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
            Select a file to see the FileUploadItem in action:
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Control Buttons */}
        {file && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={simulateUpload}
              disabled={status === 'uploading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simulate Upload
            </button>
            <button
              onClick={simulateError}
              disabled={status === 'uploading'}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simulate Error
            </button>
            <button
              onClick={resetToIdle}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Reset to Idle
            </button>
          </div>
        )}
      </div>

      {/* FileUploadItem Display */}
      {file && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">FileUploadItem Component:</h4>
          <FileUploadItem
            fileName={file.name}
            fileSize={file.size.toString()}
            mimeType={file.type}
            status={status}
            progress={progress}
            showPreview={true}
            errorsUpload={errorMessage}
            onCancel={handleCancel}
            onReload={handleReload}
          />
        </div>
      )}

      {/* Status Information */}
      {file && (
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Current Status:</strong> {status}</p>
          {status === 'uploading' && <p><strong>Progress:</strong> {progress}%</p>}
          {status === 'error' && (
            <p><strong>Errors:</strong> {errorMessage.join(', ')}</p>
          )}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="text-sm text-gray-600 space-y-2">
        <h4 className="font-medium text-gray-700">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>Select a file using the file input above</li>
          <li>Use the control buttons to simulate different states</li>
          <li>Observe how the FileUploadItem component responds to different props</li>
          <li>Try the cancel and reload functionality</li>
        </ol>
      </div>
    </div>
  )
}

export default FileUploadItemExample
        `,
      },
    },
  },
} satisfies Meta<typeof FileUploadItemExample>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive example demonstrating the FileUploadItem component.
 * This example allows you to:
 * - Select a file to see the component in action
 * - Simulate different upload states (idle, uploading, success, error)
 * - Test the cancel and reload functionality
 * - Observe how the component responds to different props
 */
export const Default: Story = {
  args: {},
}
