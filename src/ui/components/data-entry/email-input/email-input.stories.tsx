import type { Meta, StoryObj } from '@storybook/react'
import { withTimestampsAsISOStrings } from '../../../../scalars/index.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { EmailInput } from './email-input.js'

/**
 * The `EmailInput` component provides an input field for selecting email.
 * It supports multiple configuration properties like:
- `label`: string — Label of the field (e.g., "Email Address")
- `description`: string — A short description of the field's purpose (e.g., "Enter your primary email address.")
- `errors`: array — A list of `{ code: string, message: string }` objects indicating validation errors
- `required`: boolean — Indicates whether the field is mandatory (`true`) or optional (`false`)
- `value`: string | null — The current email address entered by the user, or `null` if not set
- `defaultValue`: string | null — A default email value if one is provided, or `null` if there is no default
 *
 * Features include:
 * - `autoComplete`: boolean — Indicates whether the browser's auto-complete feature is enabled (`true`) or disabled (`false`)
 * - `placeholder`: string — Placeholder text displayed inside the input field when empty

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
