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
    fileName: {
      control: 'text',
      description: 'Name of the uploaded file',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    fileSize: {
      control: 'number',
      description: 'Size of the uploaded file in bytes',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Upload progress percentage (0-100)',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback when cancel button is clicked',
    },
    onReload: {
      action: 'reload',
      description: 'Callback when reload button is clicked',
    },
    errorsUpload: {
      control: 'object',
      description: 'Array of upload error messages',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    status: {
      control: 'select',
      options: ['idle', 'uploading', 'success', 'error'],
      description: 'Current upload status',
      table: {
        type: { summary: 'UploadFile' },
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
    allowedFileTypes: ['image/png', 'image/jpg', 'image/jpeg', 'text/plain', 'application/epub+zip'],
    maxFileSize: 15728640,
    fileName: 'example.png',
    fileSize: 256000,
    status: 'idle',
  },
}
