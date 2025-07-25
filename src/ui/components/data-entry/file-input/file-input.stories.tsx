import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { FileInput } from './file-input.js'

/**
 * The `FileInput` component provides an input field for entering files.
 */
const meta: Meta<typeof FileInput> = {
  title: 'Data Entry/File Input',
  component: FileInput,
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
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
  },
  args: {
    name: 'file-input',
    dragAndDropEnabled: true,
  },
}

export default meta
type Story = StoryObj<typeof FileInput>

export const Default: Story = {
  args: {
    name: 'file-input',
    label: 'Upload File',
    description: 'Click to chose files',
    allowedFileTypes: ['xls', 'xlsx', 'png', 'docs'],
    maxFileSize: 15728640,
  },
}
