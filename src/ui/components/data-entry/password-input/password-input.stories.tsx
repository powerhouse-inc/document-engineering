import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { PasswordInput } from './password-input.js'

/**
 * ## Password input component
 *
 * `PasswordInput` is a specialized input component for handling passwords.
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
    showPasswordStrengthOpen: true,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Password input addition',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Password input removal',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Password input mixed',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'mixed',
  },
}
