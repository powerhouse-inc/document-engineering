import type { Meta, StoryObj } from '@storybook/react'
import { withTimestampsAsISOStrings } from '../../../../scalars/index.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { EmailInput } from './email-input.js'

/**
 * The `EmailInput` component provides an input field for entering email addresses.
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [EmailField](?path=/docs/scalars-email-field--readme)
 * > component.
 */
const meta: Meta<typeof EmailInput> = {
  title: 'Data Entry/Email Input',
  component: EmailInput,
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  decorators: [withTimestampsAsISOStrings],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,
    ...PrebuiltArgTypes.autoComplete,
    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
    ...PrebuiltArgTypes.className,
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
  },
  args: {
    name: 'email-input',
  },
}

export default meta
type Story = StoryObj<typeof EmailInput>

export const Default: Story = {
  args: {
    name: 'email-input',
    label: 'Email Address',
    placeholder: 'Enter your email address',
  },
}

export const Filled: Story = {
  args: {
    name: 'email-input',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    value: 'test@example.com',
  },
}
