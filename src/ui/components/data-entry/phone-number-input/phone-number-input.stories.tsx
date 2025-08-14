import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { PhoneNumberInput } from './phone-number-input.js'

/**
 * ## Phone number input component
 *
 * `PhoneNumberInput` is a specialized input component for handling phone numbers.
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [PhoneNumberField](?path=/docs/scalars-phone-number-field--readme)
 * > component.
 */

const meta: Meta<typeof PhoneNumberInput> = {
  title: 'Data Entry/Phone Number Input',
  component: PhoneNumberInput,
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
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),

    allowedCountries: {
      control: 'object',
      description: 'List of allowed country codes',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    excludedCountries: {
      control: 'object',
      description: 'List of country codes to exclude',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    includeDependentAreas: {
      control: 'boolean',
      description: 'Whether to include dependent territories in country list',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    prefixOptionFormat: {
      control: 'radio',
      options: ['CodesOnly', 'FlagsOnly', 'FlagsAndCodes', 'FlagsAndNumbers'],
      description: 'How to display country options in the prefix dropdown',
      table: {
        type: { summary: '"CodesOnly" | "FlagsOnly" | "FlagsAndCodes" | "FlagsAndNumbers"' },
        defaultValue: { summary: '"FlagsAndNumbers"' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
  },
  args: {
    name: 'phone-number-input',
    label: 'Phone number',
  },
} satisfies Meta<typeof PhoneNumberInput>

export default meta
type Story = StoryObj<typeof PhoneNumberInput>

export const Default: Story = {}

export const Filled: Story = {
  args: {
    defaultValue: '+14155552671',
  },
}
