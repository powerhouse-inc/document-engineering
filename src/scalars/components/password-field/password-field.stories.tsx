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
 *
 * ### Example of use with custom validation:
 *
 * ```tsx
 * // TODO: add a custom validation example
 * ```
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
  render: () => (
    <div className="flex flex-col gap-4">
      <PasswordField name="password" label="Password" placeholder="Enter your password" />
      <PasswordField
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        matchFieldName="password"
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
