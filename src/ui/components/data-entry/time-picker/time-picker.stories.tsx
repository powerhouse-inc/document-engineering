import type { Meta, StoryObj } from '@storybook/react'
import { getDefaultArgTypes, StorybookControlCategory } from '../../../../scalars/lib/storybook-arg-types.js'
import { TimePicker } from './time-picker'

/**
 * The `TimePicker` component provides an input field for selecting times.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - timeFormat
 * - timeIntervals
 * - timeZone
 * - showTimezoneSelect
 *
 * Features include:
 * - Customizable time format (12/24 hour)
 * - Configurable time intervals
 * - Timezone selection support
 * - Custom placeholder support
 *
 * ## Time Picker Customization
 * The time picker can be customized using the `className` prop which accepts a string of Tailwind classes.
 * Each class should follow the format `[&_.time-picker\\_\\_{element}]:{tailwind-classes}`.
 *
 * Base classes available for customization:
 * - .base-picker__input: Input field container
 * - .base-picker__popover: Popover container
 * - .time-picker__content: Main container for the time picker
 * - .time-picker__period: AM/PM selector section
 * - .time-picker__selector: Time selection area (hours/minutes)
 * - .time-picker__buttons: Container for action buttons (Cancel/OK)
 * - .time-picker__select: Individual time selection buttons
 * - .time-picker__hour: Hour display in 24-hour format
 * - .time-picker__minute: Minute display
 * - .time-picker__separator: Colon separator between hours and minutes
 * - .time-picker__am-pm: AM/PM button in 12-hour format
 *
 * # Example Usage
 * When using Tailwind CSS with custom class names, use `String.raw` to properly escape class names:
 *
 * ```tsx
 * <TimePicker
 *   name="custom-time"
 *   label="Select Time"
 *   className={String.raw`
 *     [&_.time-picker\\_\\_content]:bg-blue-100
 *     [&_.time-picker\\_\\_selector]:[&>div]:bg-green-100
 *     [&_.time-picker\\_\\_period]:[&>button]:text-red-500
 *     [&_.time-picker\\_\\_buttons]:[&>button]:bg-gray-800
 *   `}
 * />
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [Time Picker](?path=/docs/scalars-timepickerfield--readme)
 * > component.
 */

const meta: Meta<typeof TimePicker> = {
  title: 'Data Entry/Time Picker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    timeFormat: {
      control: {
        type: 'select',
      },
      description: 'The format of the time in the time picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },

      options: ['hh:mm a', 'HH:mm'],
      defaultValue: { summary: 'hh:mm a' },
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
    viewMode: {
      control: 'select',
      options: ['edition', 'addition', 'removal', 'mixed'],
      defaultValue: 'edition',
      description: 'The mode of the time picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DIFF,
      },
    },
    baseValue: {
      control: 'text',
      description: 'The base value of the time picker',
      table: {
        category: StorybookControlCategory.DIFF,
      },
    },
  },

  args: {
    name: 'time-picker-field',
  },
}

export default meta
type Story = StoryObj<typeof meta>

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

export const WithCustomizedCalendar: Story = {
  args: {
    name: 'time',
    label: 'Pick a time',
    placeholder: 'HH:mm',
    className: String.raw`
      [&.base-picker\\_\\_input]:w-[275px]
      [&.base-picker\\_\\_popover]:w-[275px]
      [&_.time-picker\\_\\_content]:bg-red-300
      [&_.time-picker\\_\\_content]:border-2
      [&_.time-picker\\_\\_content]:border-cyan-400
      [&_.time-picker\\_\\_content]:rounded-lg
      [&_.time-picker\\_\\_content]:p-2
      [&_.time-picker\\_\\_content]:transition-all
      [&_.time-picker\\_\\_content]:duration-300
      [&_.time-picker\\_\\_content]:font-mono
      [&_.time-picker\\_\\_content]:text-lg
      [&_.time-picker\\_\\_content]:border-b
      [&_.time-picker\\_\\_content]:border-cyan-400/30
      [&_.time-picker\\_\\_period]:[&>button]:text-blue-500
      [&_.time-picker\\_\\_period]:[&>button[data-selected=true]]:bg-blue-100
      [&_.time-picker\\_\\_period]:[&>button[data-selected=true]]:rounded-md
      [&_.time-picker\\_\\_period]:[&>button[data-selected=true]]:font-bold
      [&_.time-picker\\_\\_selector]:[&>div]:bg-green-500
      [&_.time-picker\\_\\_buttons]:[&>button]:text-gray-900 
      [&_.time-picker\\_\\_select]:[&>button]:text-gray-900
      [&_.time-picker\\_\\_select]:[&>button]:bg-red-500
      [&_.time-picker\\_\\_select]:[&>button]:rounded-lg
      [&_.time-picker\\_\\_select]:[&>button]:p-2
      [&_.time-picker\\_\\_select]:[&>button]:transition-all
      [&_.time-picker\\_\\_select]:[&>button]:duration-300
    `,
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
