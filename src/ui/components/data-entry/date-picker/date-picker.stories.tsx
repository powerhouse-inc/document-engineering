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
 * The calendar can be customized using the `calendarClassName` prop which accepts a string of BEM-style classes.
 * Each class should follow the format `date-picker__{element}.{tailwind-classes}`.
 *
 * Available elements for customization:
 * - `date-picker__popover`: Styles for the popover container
 * - `date-picker__calendar`: Styles for the calendar container
 * - `date-picker__button-next`: Styles for the next month button
 * - `date-picker__button-previous`: Styles for the previous month button
 * - `date-picker__selected`: Styles for selected dates
 * - `date-picker__today`: Styles for today's date
 * - `date-picker__weekday`: Styles for weekday headers
 * - `date-picker__day-button`: Styles for day buttons
 * - `date-picker__day`: Styles for day cells
 * - `date-picker__outside`: Styles for days outside current month
 * - `date-picker__month-caption`: Styles for month/year caption
 * - `date-picker__months`: Styles for months container
 * - `date-picker__month`: Styles for month container
 * - `date-picker__week`: Styles for week container
 * - `date-picker__range-start`: Styles for range start date
 * - `date-picker__range-end`: Styles for range end date
 * - `date-picker__range-middle`: Styles for dates in range
 * - `date-picker__nav`: Styles for navigation container
 * - `date-picker__month-grid`: Styles for month grid
 * - `date-picker__caption`: Styles for caption container
 * - `date-picker__caption-label`: Styles for caption label
 * - `date-picker__weekdays`: Styles for weekdays container
 * - `date-picker__hidden`: Styles for hidden elements
 *
 * Example usage:
 * ```tsx
 * <DatePicker
 *   calendarClassName={`
 *     date-picker__popover.shadow-lg.rounded-md
 *     date-picker__calendar.border-2.border-purple-300.p-2
 *     date-picker__button-next.bg-red-500.text-blue-600.hover:bg-blue-50.rounded-full.p-2.transition-colors
 *     date-picker__button-previous.bg-red-500.text-blue-600.hover:bg-blue-50.rounded-full.p-2.transition-colors
 *     date-picker__selected.!bg-green-500.!text-white.font-medium.rounded-full.hover:!bg-green-600.transition-colors
 *     date-picker__today.border-2.border-blue-400.rounded-full.bg-yellow-500
 *     date-picker__weekday.text-purple-600.font-semibold.text-xs
 *     date-picker__day-button.text-blue-700.hover:text-red-900.bg-red-500
 *     date-picker__day.text-red-500 [&>button]:text-red-500
 *     date-picker__outside.opacity-40.!bg-gray-100
 *     date-picker__month-caption.bg-gray-100.p-1.font-bold
 *   `}
 * />
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [DatePicker](?path=/docs/document-engineering-scalars-date-field--readme)
 * > component.
 */
const meta: Meta<typeof DatePicker> = {
  title: 'Document Engineering/Data Entry/Date Picker',
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
    popoverClassName: {
      control: 'text',
      description: 'The clasName for the PopoverContent styles',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    calendarClassName: {
      control: 'text',
      description: 'Additional className for the calendar container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    yearGridViewClassName: {
      control: 'text',
      description: 'Additional className for the calendar year grid button',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    monthGridViewClassName: {
      control: 'text',
      description: 'Additional className for the calendar month grid button',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
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
    calendarClassName: `
    date-picker__popover.shadow-lg.rounded-md
    date-picker__calendar.border-2.border-purple-300.p-2
    date-picker__button-next.bg-red-500.text-blue-600.hover:bg-blue-50.rounded-full.p-2.transition-colors
    date-picker__button-previous.bg-red-500.text-blue-600.hover:bg-blue-50.rounded-full.p-2.transition-colors
    date-picker__selected.!bg-green-500.!text-white.font-medium.rounded-full.hover:!bg-green-600.transition-colors
    date-picker__today.border-2.border-blue-400.rounded-full.bg-yellow-500
    date-picker__weekday.text-purple-600.font-semibold.text-xs
    date-picker__day-button.text-blue-700.hover:text-red-900.bg-red-500
    date-picker__day.text-red-500 [&>button]:text-red-500
    date-picker__outside.opacity-40.!bg-gray-100
    date-picker__month-caption.bg-gray-100.p-1.font-bold
  `,
    yearGridViewClassName: 'bg-red-500',
    monthGridViewClassName: 'bg-blue-500 [&>button]:text-blue-600 [&>div>div>button]:text-red-500',
  },
}
