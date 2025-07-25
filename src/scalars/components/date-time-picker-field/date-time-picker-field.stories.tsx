import type { Meta, StoryObj } from '@storybook/react'
import { FORMAT_MAPPING } from '../../../ui/components/data-entry/date-time-picker/utils.js'
import { withForm } from '../../index.js'
import { getDefaultArgTypes, getValidationArgTypes, StorybookControlCategory } from '../../lib/storybook-arg-types.js'
import { DateTimePickerField } from './date-time-picker-field.js'

/**
 * A  `DateTimePickerField` component designed for form usage with built-in validation.
 * It renders both a `DatePicker` and `TimePicker` functionality in a single component.
 *
 * For styling examples:
 * See our Storybook docs → 🎨
 * [Date Time Picker Examples](?path=/docs/data-entry-date-time-picker--readme)
 */

const meta: Meta<typeof DateTimePickerField> = {
  title: 'Scalars/Date Time Picker Field',
  component: DateTimePickerField,
  decorators: [withForm],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes({
      enabledArgTypes: {
        value: true,
      },
    }),
    ...getValidationArgTypes({}),

    minDate: {
      control: 'date',
      description: 'Minimum selectable date in the date picker',
      table: {
        type: { summary: 'date' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date in the date picker',
      table: {
        type: { summary: 'date' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    disablePastDates: {
      control: 'boolean',
      description: 'Disable past dates in the date picker',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    disableFutureDates: {
      control: 'boolean',
      description: 'Disable future dates in the date picker',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    dateFormat: {
      control: {
        type: 'select',
      },
      description: 'The format of the date in the date picker',
      options: Object.keys(FORMAT_MAPPING),
      table: {
        defaultValue: { summary: 'YYYY-MM-DD' },
        type: {
          summary: 'string',
        },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    weekStart: {
      control: 'select',
      description: 'The first day of the week in the date picker',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      table: {
        defaultValue: { summary: 'Monday' },
        type: {
          summary: 'string',
        },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    autoClose: {
      control: 'boolean',
      description: 'Close the date picker when a date is selected',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    // Time picker props
    timeFormat: {
      control: {
        type: 'select',
      },
      description: 'The format of the time in the time picker',
      table: {
        defaultValue: { summary: 'hh:mm A' },
        type: {
          summary: 'string',
        },
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
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    timeZone: {
      control: {
        type: 'text',
      },
      description: 'The timezone to display in the time picker',

      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
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

    includeContinent: {
      control: 'boolean',
      description: 'Show continent name in the timezone select',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text for the date time picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
  },

  args: {
    name: 'date-time-picker-field',
  },
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
}

export default meta
type Story = StoryObj<typeof DateTimePickerField>

export const DateTimePicker: Story = {
  args: {
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    placeholder: '2025/01/27 12:00',
  },
}
export const WithCustomizedContent: Story = {
  args: {
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    placeholder: '2025/01/27 12:00',
    className: String.raw`
      [&_.date-time-picker\\_\\_content]:rounded-lg
      [&_.date-time-picker\\_\\_content]:border-cyan-200
      [&_.date-time-picker\\_\\_tabs]:border-cyan-200
      [&_.date-time-picker\\_\\_tabs_svg]:text-green-700
      [&_.date-time-picker\\_\\_tabs_svg[data-state=active]]:text-green-900
    `,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    name: 'date-time-picker',
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    value: '2024-06-12T11:47:34.000-03:00',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    name: 'date-time-picker',
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    baseValue: '2023-06-15T11:47:34.000-03:00',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    name: 'date-time-picker',
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    value: '2025-06-05T11:47:34.000-03:00',
    baseValue: '2024-06-05T11:47:34.000-03:00',
    viewMode: 'mixed',
  },
}
