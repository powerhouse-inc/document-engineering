import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { FileField } from './file-field.js'
import { withForm } from '#scalars/lib/decorators.js'

/**
 *
 * `FileField` is an enhanced file picker component that wraps `FileInput` with built-in validation support.
 * It provides automatic validation for file types and file size limits.
 *
 */
const meta: Meta<typeof FileField> = {
  title: 'Scalars/File Field',
  component: FileField,

  decorators: [
    withForm,
    (Story) => (
      <div className="w-[247px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.className,
    value: {
      control: 'file',
      description: 'Current value of the input field',
      table: {
        type: { summary: 'File | null' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    defaultValue: {
      control: 'file',
      description: 'Default value for the input field',
      table: {
        type: { summary: 'File | null' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    allowedFileTypes: {
      control: 'object',
      description: 'Array of allowed MIME types for file uploads',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.VALIDATION,
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.VALIDATION,
      },
    },
    dragAndDropEnabled: {
      control: 'boolean',
      defaultValue: true,
      description: 'Enable or disable drag-and-drop functionality',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    status: {
      control: 'select',
      options: ['idle', 'uploading', 'success', 'error'],
      description: 'Controls the visual state of the upload item, determining which UI is rendered.',
      defaultValue: 'idle',
      table: {
        type: { summary: "'idle' | 'uploading' | 'success' | 'error'" },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        defaultValue: { summary: 'idle' },
      },
    },
    fileName: {
      control: 'text',
      description: 'The name of the file to display. Must be provided once the file is selected.',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    fileSize: {
      control: 'number',
      description: 'The file size in bytes. The component formats it automatically (KB, MB).',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    mimeType: {
      control: 'text',
      description: 'The MIME type of the file (e.g., "image/png"), used to display the correct icon.',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      if: { arg: 'status', eq: 'uploading' },
      description: 'The upload progress (0-100). Only visible when status is "uploading".',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    showPreview: {
      control: 'boolean',
      description: 'If true, displays the "Preview" button when the status is "success".',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        defaultValue: { summary: 'false' },
      },
    },
    errorsUpload: {
      control: 'object',
      description: 'List of error messages to display if status is "error".',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback function invoked when the cancel button (X) is pressed.',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        type: { summary: '(e: MouseEvent) => void' },
      },
    },
    onReload: {
      action: 'reload',
      description: 'Callback function to retry the upload. Only visible if status is "error".',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        type: { summary: '(e: MouseEvent) => void' },
      },
    },
    isBase64Encoded: {
      control: 'boolean',
      description: 'If true, the file is encoded in base64.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
      },
    }),
  },
}

export default meta
type Story = StoryObj<typeof FileField>

export const Default: Story = {
  args: {
    name: 'file-input',
    label: 'Upload File',
    description: 'Click to chose files',
    allowedFileTypes: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf', 'text/plain', 'application/epub+zip'],
    maxFileSize: 15728640,
    fileName: 'example.png',
    fileSize: 256000,
    status: 'idle',
  },
}

export const WithUploadedFile: Story = {
  args: {
    ...Default.args,
    fileName: 'example.png',
    fileSize: 256000,
    status: 'uploading',
    mimeType: 'image/png',
    progress: 90,
  },
}

export const WithPreview: Story = {
  args: {
    ...Default.args,
    fileName: 'example.png',
    fileSize: 256000,
    status: 'success',
    mimeType: 'image/png',
    progress: 100,
    showPreview: true,
  },
}
