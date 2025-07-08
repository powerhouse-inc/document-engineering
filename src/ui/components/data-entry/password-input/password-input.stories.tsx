import type { Meta, StoryObj } from '@storybook/react'
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
 * - Character requirements (uppercase, lowercase, numbers, special characters)
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
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),

    // TODO: Implement commented props
    /* requireUppercase: {
      control: 'boolean',
      description: 'The field value requires at least one capital letter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    requireLowercase: {
      control: 'boolean',
      description: 'The field value requires at least one lowercase letter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    requireNumbers: {
      control: 'boolean',
      description: 'The field value requires at least one number',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    requireSpecialCharacters: {
      control: 'boolean',
      description:
        'The field value requires at least one special character (from the list between double quotes): " !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~"',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    disallowCommonPasswords: {
      control: 'boolean',
      description: 'Disallows commonly used or compromised passwords as valid input in the field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    }, */

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
