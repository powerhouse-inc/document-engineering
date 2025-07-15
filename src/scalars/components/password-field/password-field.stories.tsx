import type { Meta, StoryObj } from '@storybook/react'
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
 * ## Password field component
 *
 * `PasswordField` is a specialized form component for handling passwords with built-in validation.
 * It is based on [PasswordInput](?path=/docs/data-entry-password-input--readme) component
 * which uses the
 * <a href="https://zxcvbn-ts.github.io/zxcvbn/guide/" target="_blank" rel="noopener noreferrer">zxcvbn-ts</a>
 *  library to determine the strength of the password.
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

    showPasswordStrength: {
      control: 'boolean',
      description: 'Displays a password strength meter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    matchFieldName: {
      control: 'text',
      description:
        'Name of another password field in the form to validate the value match. Useful for confirmation fields like "Confirm Password" which must match the value of the original field.',
      table: {
        type: { summary: 'string' },
        detail:
          'When provided, this field will validate that its value matches the value of the field with the specified name. Common use case: email confirmation fields.',
        category: StorybookControlCategory.VALIDATION,
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
    showPasswordStrengthOpen: true,
  },
}

export const WithPasswordConfirmation: Story = {
  parameters: {
    docs: {
      source: {
        code: `
<Form defaultValues={{ password: '', confirmPassword: '' }}>
  <PasswordField name="password" label="Password" placeholder="Enter your password" />
  <PasswordField name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" matchFieldName="password" />
  <Button type="submit">Submit</Button>
</Form>
        `,
      },
      description: {
        story:
          'This story variant shows how to use `matchFieldName` prop to create password confirmation fields. The second field validates that it matches the value of the first one.',
      },
    },
  },
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <PasswordField {...args} />
      <PasswordField
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        matchFieldName="password"
        showPasswordStrength={false}
      />
    </div>
  ),
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Password field addition',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Password field removal',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Password field mixed',
    placeholder: 'Password',
    defaultValue: 'new password',
    baseValue: 'old password',
    viewMode: 'mixed',
  },
}

export const WithCustomValidator: Story = {
  parameters: {
    docs: {
      source: {
        code: `
// Custom validator that checks against a database of leaked passwords
const leakedPasswordValidator = async (value: string) => {
  if (!value) return true
  
  // Simulate API call to check password breach database
  const isLeaked = await checkPasswordBreach(value)
  
  if (isLeaked) {
    return 'This password has been found in data breaches and is not secure. Please choose a different password.'
  }
  
  return true
}

<PasswordField
  name="password"
  label="Password"
  placeholder="Enter a secure password"
  validators={leakedPasswordValidator}
/>
        `,
      },
      description: {
        story:
          'This story variant demonstrates custom password validation using the `validators` prop. It simulates checking the password against a database of leaked passwords and shows an error message if the password has been exposed. ' +
          'For demonstration purposes, the following passwords are considered leaked: ' +
          '12345678, password, password1, password123, admin, qwerty, welcome, monkey, dragon, master, admin123, welcome123, Password1, Password123',
      },
    },
  },
  args: {
    label: 'Secure password',
    placeholder: 'Enter a secure password',
    description:
      'Enter any of the following passwords to see the validation in action: 12345678, password, password1, password123, admin, qwerty, welcome, monkey, dragon, master, admin123, welcome123, Password1, Password123',
    showPasswordStrength: false,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialCharacters: false,
    showErrorOnChange: true,
    validators: async (value: string) => {
      if (!value) return true

      const leakedPasswords = [
        '12345678',
        'password',
        'password1',
        'password123',
        'admin',
        'qwerty',
        'welcome',
        'monkey',
        'dragon',
        'master',
        'admin123',
        'welcome123',
        'Password1',
        'Password123',
      ]

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (leakedPasswords.includes(value)) {
        return 'This password has been found in data breaches and is not secure. Please choose a different password.'
      }

      return true
    },
  },
}
