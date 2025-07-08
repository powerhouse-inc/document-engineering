import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { EmailField } from './email-field.js'

const meta: Meta<typeof EmailField> = {
  title: 'Scalars/Email Field',
  component: EmailField,
  decorators: [withForm],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,
    ...PrebuiltArgTypes.autoComplete,
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
      },
    }),
    ...PrebuiltArgTypes.minLength,
    ...PrebuiltArgTypes.maxLength,
    ...PrebuiltArgTypes.pattern,
    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
    allowedDomains: {
      control: 'object',
      description: 'Allowed domains for the email field',
      table: {
        type: { summary: 'string[]' },
        detail: 'Array of allowed domains',
        category: StorybookControlCategory.VALIDATION,
      },
    },
    matchFieldName: {
      control: 'text',
      description: 'Name of the field to match',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.VALIDATION,
      },
    },
  },
  args: {
    name: 'email-field',
  },
}

export default meta
type Story = StoryObj<typeof EmailField>

export const Default: Story = {
  args: {
    label: 'Email Input',
    placeholder: 'Enter your email',
  },
}
export const Filled: Story = {
  args: {
    label: 'Email Input',
    placeholder: 'Enter your email',
    value: 'john.doe@example.com',
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Number difference addition',
    value: 'test@gmail.com',
    baseValue: 'other@example.com',
    viewMode: 'addition',
  },
}
export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Date difference removal',
    value: 'test@gmail.com',
    baseValue: 'test@example.com',
    viewMode: 'removal',
  },
}
export const WithDifferencesMixed: Story = {
  args: {
    label: 'Date difference mixed',
    value: 'other@example.com',
    baseValue: 'test@example.com',
    viewMode: 'mixed',
  },
}

export const WithEmailMatchForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <EmailField label="Email Address" name="email" placeholder="Enter your email" />
      <EmailField label="Confirm Email" name="confirmEmail" placeholder="Confirm your email" matchFieldName="email" />
    </div>
  ),
}
