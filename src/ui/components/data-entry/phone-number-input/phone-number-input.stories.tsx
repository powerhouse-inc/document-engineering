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
 * `PhoneNumberInput` is a specialized input component for handling phone numbers formatted according to the
 * <a href="https://www.itu.int/rec/T-REC-E.164-201011-I/en" target="_blank" rel="noopener noreferrer">ITU-T E.164</a> recommendation.
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
    ...PrebuiltArgTypes.pattern,
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
    prefixProps: {
      control: 'object',
      description: 'Configs for the prefix dropdown',
      table: {
        type: {
          summary: '{ placeholder?: string; searchable?: boolean; className?: string; contentClassName?: string; }',
        },
        defaultValue: {
          summary: '{ placeholder: "+1", searchable: true, className: undefined, contentClassName: undefined }',
        },
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

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Phone number addition',
    defaultValue: '+14155552671',
    baseValue: '+442072705238',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Phone number removal',
    defaultValue: '+14155552671',
    baseValue: '+442072705238',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Phone number mixed',
    defaultValue: '+14155552671',
    baseValue: '+442072705238',
    viewMode: 'mixed',
  },
}
