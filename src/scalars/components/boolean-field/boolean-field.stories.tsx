import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import { getDefaultArgTypes, getValidationArgTypes, StorybookControlCategory } from '../../lib/storybook-arg-types.js'
import { BooleanField } from './boolean-field.js'

const meta = {
  title: 'Scalars/Boolean Field',
  component: BooleanField,
  decorators: [withForm],
  argTypes: {
    ...getDefaultArgTypes({
      enabledArgTypes: {
        value: false,
      },
      valueControlType: 'boolean',
      valueType: 'boolean',
    }),

    value: {
      control: 'inline-radio',
      options: ['indeterminate', true, false],
      description: 'Current value of the input field',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.DEFAULT,
      },
    },

    isToggle: {
      control: 'boolean',
      description: 'Whether the field is a toggle or checkbox',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    optionalLabel: {
      control: 'text',
      description: 'The label of the optional field',
      table: {
        category: StorybookControlCategory.DIFF,
      },
      if: { arg: 'isToggle', eq: true },
    },
    viewMode: {
      control: 'select',
      description: 'The mode of the input field',
      options: ['edition', 'addition', 'removal'],
      table: {
        type: { summary: 'edition | addition | removal' },
        defaultValue: { summary: 'edition' },
        category: StorybookControlCategory.DIFF,
      },
    },
    baseValue: {
      control: 'boolean',
      description: 'The base value of the input field',
      table: {
        category: StorybookControlCategory.DIFF,
      },
    },
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
  },
  args: {
    name: 'boolean-field',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A boolean field component that can be used as a [checkbox](?path=/docs/data-entry-checkbox--readme) or [toggle](?path=/docs/data-entry-toggle--readme) depending on the `isToggle` prop.',
      },
    },
  },
} satisfies Meta<typeof BooleanField>

export default meta
type Story = StoryObj<typeof BooleanField>

export const Checkbox: Story = {
  args: {
    label: 'Checkbox Field',
    description: 'This is a checkbox field',
    isToggle: false,
  },
}

export const Toggle: Story = {
  args: {
    label: 'Toggle Field',
    description: 'This is a toggle field',
    isToggle: true,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Number difference addition',
    value: true,
    baseValue: false,
    isToggle: true,
    viewMode: 'addition',
  },
}
export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Number difference removal',
    value: false,
    baseValue: true,
    isToggle: false,
    viewMode: 'removal',
  },
}
