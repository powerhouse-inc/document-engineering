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
 * Base classes available for customization:
 * - .base-picker__input: Input field container
 * - .base-picker__popover: Popover container
 * - .date-picker__calendar: Calendar container
 * - .date-picker__button-next: Next month button
 * - .date-picker__button-previous: Previous month button
 * - .date-picker__selected: Selected dates
 * - .date-picker__today: Today's date
 * - .date-picker__weekday: Weekday headers
 * - .date-picker__day-button: Day buttons
 * - .date-picker__day: Day cells
 * - .date-picker__outside: Days outside current month
 * - .date-picker__month-caption: Month/year caption
 * - .date-picker__months: Months container
 * - .date-picker__month: Month container
 * - .date-picker__week: Week container
 * - .date-picker__range-start: Range start date
 * - .date-picker__range-end: Range end date
 * - .date-picker__range-middle: Dates in range
 * - .date-picker__nav: Navigation container
 * - .date-picker__month-grid: Month grid
 * - .date-picker__caption: Caption container
 * - .date-picker__caption-label: Caption label
 * - .date-picker__weekdays: Weekdays container
 * - .date-picker__hidden: Hidden elements
 * - .date-picker__year-grid--view: Year grid view
 * - .date-picker__month-grid--view: Month grid view
 * - .date-picker__date-footer: This is class for button footer in month and year view

**
 * # Example Usage
 *
 * When using Tailwind CSS with custom class names, we need to use `String.raw` because Tailwind
 * interprets underscores (`_`) as class separators. Without `String.raw`, the escape characters don't work
 * properly and you would need to use four backslashes (`\\\\`) to make it work. Using `String.raw` ensures
 * that the class names with underscores are properly escaped and interpreted by Tailwind.
 *
 * Here's an example of how to use the DatePicker component with custom class for styling:
 *
 * ```tsx
 * import { DatePicker } from './date-picker'
 *
 * function MyCustomDatePicker() {
 *   return (
 *     <DatePicker
 *       name="custom-date"
 *       label="Select Date"
 *       placeholder="YYYY/MM/DD"
 *       className={String.raw`
 *         [&_.date-picker\\_\\_button-next]:bg-blue-500
 *         [&_.date-picker\\_\\_button-next]:text-white
 *         [&_.date-picker\\_\\_button-next]:rounded-full
 *         [&_.date-picker\\_\\_selected]:!bg-blue-500
 *         [&_.date-picker\\_\\_selected]:!text-white
 *         [&_.date-picker\\_\\_today]:border-2
 *         [&_.date-picker\\_\\_today]:border-blue-500
 *         [&_.date-picker\\_\\_weekday]:text-blue-500
 *         [&_.date-picker\\_\\_day-button]:hover:bg-blue-100
 *       `}
 *     />
 *   )
 * }
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [Date Picker Field](?path=/docs/scalars-date-picker-field--readme)
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
      description: 'Additional className for customizing the calendar',
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
      [&.input-field]:border-cyan-400
      [&.input-field]:rounded-md
  
    `,
  },
}
