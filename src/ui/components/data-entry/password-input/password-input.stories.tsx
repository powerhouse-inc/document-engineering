import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { PasswordInput } from './password-input.js'

/**
 * The `PasswordInput` component provides an input field for password entry.
 *
 * Features include:
 * - Secure password masking with toggle visibility
 * - Password strength meter with suggestions display
 * - Common password detection and prevention
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [PasswordField](?path=/docs/scalars-password-field--readme)
 * > component.
 */

const meta: Meta<typeof PasswordInput> = {
  title: 'Data Entry/Password Input',
  component: PasswordInput,
  decorators: [
    (Story) => (
      <div style={{ width: '280px', margin: '1rem auto 0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,
    ...PrebuiltArgTypes.minLength,
    ...PrebuiltArgTypes.maxLength,
    ...PrebuiltArgTypes.pattern,
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),

    showPasswordStrength: {
      control: 'boolean',
      description: 'Displays a password strength meter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
  },
  args: {
    name: 'password-input',
  },
} satisfies Meta<typeof PasswordInput>

export default meta

type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
  args: {
    label: 'Password input',
    placeholder: 'Password',
  },
}

export const Filled: Story = {
  args: {
    label: 'Password input',
    placeholder: 'Password',
    defaultValue: 'H0l4.mundo',
  },
}

export const WithPasswordStrength: Story = {
  args: {
    label: 'Password input',
    placeholder: 'Password',
    defaultValue: 'weakpassword',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const passwordInput = canvas.getByLabelText('Password input')
    await userEvent.click(passwordInput)
  },
}
