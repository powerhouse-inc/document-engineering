import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { TimePickerField } from './time-picker-field.js'

/**
 * A time picker component designed for form usage with built-in validation.
 *
 * Key features:
 * - Seamless form integration
 * - Input validation out of the box
 * - Customizable styling via Tailwind CSS (className prop)
 * - Timezone selection support
 *
 * For styling examples and implementation details:
 * See our Storybook docs → 🎨
 * [Time Picker Examples](?path=/docs/data-entry-time-picker--readme)
 */

const meta: Meta<typeof TimePickerField> = {
  title: 'Scalars/Time Picker Field',
  component: TimePickerField,
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  decorators: [withForm],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...getValidationArgTypes(),
    timeFormat: {
      control: {
        type: 'select',
      },
      description: 'The format of the time in the time picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },

      options: ['hh:mm A', 'HH:mm'],
      defaultValue: { summary: 'hh:mm A' },
    },
    showTimezoneSelect: {
      control: {
        type: 'boolean',
      },
      description: 'Show timezone select',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        type: { summary: 'boolean' },
      },
    },
    timeIntervals: {
      description: 'The interval between each time option',
      control: {
        type: 'number',
      },

      type: 'number',
      min: 1,
      max: 60,
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },

      defaultValue: { summary: 1 },
    },
    timeZone: {
      description: 'The timezone to display in the time picker',
      control: {
        type: 'text',
      },
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        type: { summary: 'string' },
      },
    },
    includeContinent: {
      description: 'Show continent name in the timezone select',
      control: {
        type: 'boolean',
        defaultValue: false,
      },
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        defaultValue: { summary: 'false ' },
        type: { summary: 'boolean' },
      },
    },
    placeholder: {
      description: 'The placeholder text for the time picker',
      table: {
        category: StorybookControlCategory.DEFAULT,
        type: { summary: 'string' },
      },
    },
    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
  },

  args: {
    name: 'time-picker-field',
  },
}

export default meta
type Story = StoryObj<typeof TimePickerField>

export const Default: Story = {
  args: {
    name: 'time',
    label: 'Pick a time',
    placeholder: 'HH:mm',
  },
}
export const Disabled: Story = {
  args: {
    name: 'time',
    label: 'Pick a time',
    placeholder: 'HH:mm',
    disabled: true,
  },
}

export const Filled: Story = {
  args: {
    name: 'time',
    label: 'Pick a time',
    value: '12:00 PM',
    placeholder: 'HH:mm',
  },
}
export const WithDifferencesAddition: Story = {
  args: {
    label: 'Time difference addition',
    value: '12:00 PM',
    baseValue: '11:00 AM',
    viewMode: 'addition',
  },
}
export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Time difference removal',
    value: '12:00 PM',
    baseValue: '11:00 AM',
    viewMode: 'removal',
  },
}
export const WithDifferencesMixed: Story = {
  args: {
    label: 'Time difference mixed',
    value: '12:00 PM',
    baseValue: '11:00 AM',
    viewMode: 'mixed',
  },
}
