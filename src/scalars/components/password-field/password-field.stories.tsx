import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { specialCharacters } from '../../../ui/components/data-entry/password-input/utils.js'
import { PasswordField } from './password-field.js'

/**
 * A `PasswordField` component designed for form usage with built-in validation.
 *
 * > **Note:** Must be used within a form context provider.
 * > Use the `withForm` decorator in Storybook for quick testing.
 */

const meta: Meta<typeof PasswordField> = {
  title: 'Scalars/Password Field',
  component: PasswordField,
  decorators: [
    withForm,
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
    ...getValidationArgTypes(),

    requireUppercase: {
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
      description: `The field value requires at least one special character: ${specialCharacters}`,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    // TODO: Implement disallowCommonPasswords
    /* disallowCommonPasswords: {
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
    name: 'password-field',
  },
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof PasswordField>

export const Default: Story = {
  args: {
    label: 'Password field',
    placeholder: 'Password',
  },
}

export const Filled: Story = {
  args: {
    label: 'Password field',
    placeholder: 'Password',
    defaultValue: 'H0l4.mundo',
  },
}

export const WithPasswordStrength: Story = {
  args: {
    label: 'Password field',
    placeholder: 'Password',
    defaultValue: 'weakpassword',
  },
  parameters: {
    chromatic: {
      delay: 1000,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const passwordInput = canvas.getByLabelText('Password field')
    await userEvent.click(passwordInput)
  },
}
