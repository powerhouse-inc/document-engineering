import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { FileInput } from './file-input.js'

/**
 * ## FileInput Component
 *
 * `FileInput` is a form input component for uploading a single file, supporting drag-and-drop and manual selection.
 *
 * > **Note:** This component acts as a form input and can be used within forms. For enhanced validation and form integration, consider using the [`FileField`](?path=/docs/scalars-file-field--readme) component, which wraps `FileInput` with validation support and form bindings.
 */
const meta: Meta<typeof FileInput> = {
  title: 'Data Entry/File Input',
  component: FileInput,

  decorators: [
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
      description: 'Allowed file types',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    dragAndDropEnabled: {
      control: 'boolean',
      defaultValue: true,
      description: 'Drag and drop enabled',
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
        showErrorOnChange: false,
      },
    }),
  },
}

export default meta
type Story = StoryObj<typeof FileInput>

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
