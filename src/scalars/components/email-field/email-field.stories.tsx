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
    allowedDomains: {
      control: 'object',
      description: 'Allowed domains for the email field',
      table: {
        type: { summary: 'string[]' },
        detail: 'Array of allowed domains',
        category: StorybookControlCategory.DEFAULT,
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
