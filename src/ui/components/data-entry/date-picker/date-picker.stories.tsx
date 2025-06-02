import type { Meta, StoryObj } from '@storybook/react'
import { withTimestampsAsISOStrings } from '../../../../scalars/index.js'
import { getDefaultArgTypes, StorybookControlCategory } from '../../../../scalars/lib/storybook-arg-types.js'
import { FORMAT_MAPPING } from '../date-time-picker/utils.js'
import { DatePicker } from './date-picker.js'

/**
 * The `DatePicker` component provides an input field for selecting dates.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - minDate
 * - maxDate
 * - dateFormat
 * - weekStart
 * - autoClose
 *
 * Features include:
 * - Customizable date format
 * - Min/Max date restrictions
 * - Past/Future date restrictions
 * - Configurable week start day
 * - Auto-close functionality
 * - Custom placeholder support
 *
 * ## Calendar Customization
 * The calendar can be customized using the `className` prop which accepts a string of Tailwind classes.
 * Each class should follow the format `[&_.date-picker\\_\\_{element}]:{tailwind-classes}`.
 *
 * Available elements for customization:
 * - `[&_.date-picker\\_\\_calendar]`: Styles for the calendar container
 * - `[&_.date-picker\\_\\_button-next]`: Styles for the next month button
 * - `[&_.date-picker\\_\\_button-previous]`: Styles for the previous month button
 * - `[&_.date-picker\\_\\_selected]`: Styles for selected dates
 * - `[&_.date-picker\\_\\_today]`: Styles for today's date
 * - `[&_.date-picker\\_\\_weekday]`: Styles for weekday headers
 * - `[&_.date-picker\\_\\_day-button]`: Styles for day buttons
 * - `[&_.date-picker\\_\\_day]`: Styles for day cells
 * - `[&_.date-picker\\_\\_outside]`: Styles for days outside current month
 * - `[&_.date-picker\\_\\_month-caption]`: Styles for month/year caption
 * - `[&_.date-picker\\_\\_months]`: Styles for months container
 * - `[&_.date-picker\\_\\_month]`: Styles for month container
 * - `[&_.date-picker\\_\\_week]`: Styles for week container
 * - `[&_.date-picker\\_\\_range-start]`: Styles for range start date
 * - `[&_.date-picker\\_\\_range-end]`: Styles for range end date
 * - `[&_.date-picker\\_\\_range-middle]`: Styles for dates in range
 * - `[&_.date-picker\\_\\_nav]`: Styles for navigation container
 * - `[&_.date-picker\\_\\_month-grid]`: Styles for month grid
 * - `[&_.date-picker\\_\\_caption]`: Styles for caption container
 * - `[&_.date-picker\\_\\_caption-label]`: Styles for caption label
 * - `[&_.date-picker\\_\\_weekdays]`: Styles for weekdays container
 * - `[&_.date-picker\\_\\_hidden]`: Styles for hidden elements
 *
 * Example usage:
 * ```tsx
 * <DatePicker
 *   className={`
 *     [&_.date-picker\\_\\_calendar]:border-2
 *     [&_.date-picker\\_\\_calendar]:border-purple-300
 *     [&_.date-picker\\_\\_calendar]:p-2
 *     [&_.date-picker\\_\\_button-next]:bg-red-500
 *     [&_.date-picker\\_\\_button-next]:text-blue-600
 *     [&_.date-picker\\_\\_button-next]:hover:bg-blue-50
 *     [&_.date-picker\\_\\_button-next]:rounded-full
 *     [&_.date-picker\\_\\_button-next]:p-2
 *     [&_.date-picker\\_\\_button-next]:transition-colors
 *     [&_.date-picker\\_\\_button-previous]:bg-red-500
 *     [&_.date-picker\\_\\_button-previous]:text-blue-600
 *     [&_.date-picker\\_\\_button-previous]:hover:bg-blue-50
 *     [&_.date-picker\\_\\_button-previous]:rounded-full
 *     [&_.date-picker\\_\\_button-previous]:p-2
 *     [&_.date-picker\\_\\_button-previous]:transition-colors
 *     [&_.date-picker\\_\\_selected]:!bg-green-500
 *     [&_.date-picker\\_\\_selected]:!text-white
 *     [&_.date-picker\\_\\_selected]:font-medium
 *     [&_.date-picker\\_\\_selected]:rounded-full
 *     [&_.date-picker\\_\\_selected]:hover:!bg-green-600
 *     [&_.date-picker\\_\\_selected]:transition-colors
 *     [&_.date-picker\\_\\_today]:border-2
 *     [&_.date-picker\\_\\_today]:border-blue-400
 *     [&_.date-picker\\_\\_today]:rounded-full
 *     [&_.date-picker\\_\\_today]:bg-yellow-500
 *     [&_.date-picker\\_\\_weekday]:text-purple-600
 *     [&_.date-picker\\_\\_weekday]:font-semibold
 *     [&_.date-picker\\_\\_weekday]:text-xs
 *     [&_.date-picker\\_\\_day-button]:text-blue-700
 *     [&_.date-picker\\_\\_day-button]:hover:text-red-900
 *     [&_.date-picker\\_\\_day-button]:bg-red-500
 *     [&_.date-picker\\_\\_day]:text-red-500
 *     [&_.date-picker\\_\\_day]:[&>button]:text-red-500
 *     [&_.date-picker\\_\\_outside]:opacity-40
 *     [&_.date-picker\\_\\_outside]:!bg-gray-100
 *     [&_.date-picker\\_\\_month-caption]:bg-gray-100
 *     [&_.date-picker\\_\\_month-caption]:p-1
 *     [&_.date-picker\\_\\_month-caption]:font-bold
 *   `}
 * />
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [DatePicker](?path=/docs/scalars-date-field--readme)
 * > component.
 */
const meta: Meta<typeof DatePicker> = {
  title: 'Data Entry/Date Picker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  decorators: [withTimestampsAsISOStrings],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes({
      valueControlType: 'date',
      valueType: 'date',
    }),
    minDate: {
      control: 'date',
      description: 'Minimum selectable date in the date picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date in the date picker',
      table: {
        type: { summary: 'string' },
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
    placeholder: {
      control: 'text',
      description: 'The placeholder text for the date picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    className: {
      control: 'text',
      description: 'Additional className for the date picker container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
  },
  args: {
    name: 'date-picker-field',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'date',
    label: 'Pick a date',
    placeholder: '2025/01/27',
  },
}

export const Disabled: Story = {
  args: {
    name: 'date',
    label: 'Pick a date',
    placeholder: '2025/01/27',
    disabled: true,
  },
}

export const Filled: Story = {
  args: {
    name: 'date',
    label: 'Pick a date',
    value: '2025/01/27',
  },
}

export const WithCustomizedCalendar: Story = {
  args: {
    name: 'date',
    label: 'Customized Calendar',
    placeholder: '2025/01/27',
    className: String.raw`
      [&_.date-picker\\_\\_button-next]:bg-transparent
      [&_.date-picker\\_\\_button-next]:border-2
      [&_.date-picker\\_\\_button-next]:border-cyan-400
      [&_.date-picker\\_\\_button-next]:text-cyan-400
      [&_.date-picker\\_\\_button-next]:hover:bg-cyan-400/10
      [&_.date-picker\\_\\_button-next]:hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]
      [&_.date-picker\\_\\_button-next]:rounded-full
      [&_.date-picker\\_\\_button-next]:p-2
      [&_.date-picker\\_\\_button-next]:transition-all
      [&_.date-picker\\_\\_button-next]:duration-300

      [&_.date-picker\\_\\_button-previous]:bg-transparent
      [&_.date-picker\\_\\_button-previous]:border-2
      [&_.date-picker\\_\\_button-previous]:border-cyan-400
      [&_.date-picker\\_\\_button-previous]:text-cyan-400
      [&_.date-picker\\_\\_button-previous]:hover:bg-cyan-400/10
      [&_.date-picker\\_\\_button-previous]:hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]
      [&_.date-picker\\_\\_button-previous]:rounded-full
      [&_.date-picker\\_\\_button-previous]:p-2
      [&_.date-picker\\_\\_button-previous]:transition-all
      [&_.date-picker\\_\\_button-previous]:duration-300

      [&_.date-picker\\_\\_selected]:!bg-cyan-400
      [&_.date-picker\\_\\_selected]:!text-black
      [&_.date-picker\\_\\_selected]:!font-mono
      [&_.date-picker\\_\\_selected]:!rounded-full
      [&_.date-picker\\_\\_selected]:hover:!bg-cyan-500
      [&_.date-picker\\_\\_selected]:transition-all
      [&_.date-picker\\_\\_selected]:duration-300

      [&_.date-picker\\_\\_today]:border-2
      [&_.date-picker\\_\\_today]:border-pink-400
      [&_.date-picker\\_\\_today]:rounded-full
      [&_.date-picker\\_\\_today]:text-pink-400

      [&_.date-picker\\_\\_weekday]:text-cyan-400
      [&_.date-picker\\_\\_weekday]:font-mono
      [&_.date-picker\\_\\_weekday]:text-sm

      [&_.date-picker\\_\\_day-button]:text-cyan-400
      [&_.date-picker\\_\\_day-button]:hover:text-cyan-300
      [&_.date-picker\\_\\_day-button]:hover:bg-cyan-400/10
      [&_.date-picker\\_\\_day-button]:rounded-full
      [&_.date-picker\\_\\_day-button]:transition-all
      [&_.date-picker\\_\\_day-button]:duration-300

      [&_.date-picker\\_\\_outside]:opacity-40
      [&_.date-picker\\_\\_outside]:!bg-gray-900

      [&_.date-picker\\_\\_month-caption]:text-cyan-400
      [&_.date-picker\\_\\_month-caption]:font-mono
      [&_.date-picker\\_\\_month-caption]:p-2
      [&_.date-picker\\_\\_month-caption]:text-lg
      [&_.date-picker\\_\\_month-caption]:border-b
      [&_.date-picker\\_\\_month-caption]:border-cyan-400/30
      [&_.date-picker\\_\\_year-grid--view]:border-2
      [&_.date-picker\\_\\_year-grid--view]:border-red-400
      [&_.date-picker\\_\\_year-grid--view]:rounded-lg
      [&_.date-picker\\_\\_year-grid--view]:p-2
      [&_.date-picker\\_\\_year-grid--view]:bg-blue-500
      [&_.date-picker\\_\\_year-grid--view]:text-white
      [&_.date-picker\\_\\_year-grid--view]:font-bold
      [&_.date-picker\\_\\_month-grid--view]:border-2
      [&_.date-picker\\_\\_month-grid--view]:border-blue-400
      [&_.date-picker\\_\\_month-grid--view]:rounded-lg
      [&_.date-picker\\_\\_month-grid--view]:p-2
      [&_.date-picker\\_\\_month-grid--view]:bg-red-500
      [&_.date-picker\\_\\_month-grid--view]:text-white
      [&_.date-picker\\_\\_month-grid--view]:font-bold
      [&_.date-picker\\_\\_month-grid--view]:button:text-blue-400
      [&_.date-picker\\_\\_date-footer]:gap-2
      [&_.date-picker\\_\\_date-footer]:[&>button]:text-blue-400
      [&_.date-picker\\_\\_date-footer]:[&>button]:hover:text-blue-500
      [&_.date-picker\\_\\_date-footer]:[&>button]:hover:bg-blue-400/10
      [&_.date-picker\\_\\_date-footer]:[&>button]:rounded-full
      [&_.date-picker\\_\\_date-footer]:[&>button]:p-2
      [&_.date-picker\\_\\_date-footer]:[&>button]:transition-all
      [&_.date-picker\\_\\_date-footer]:[&>button]:duration-300
    `,
  },
}
