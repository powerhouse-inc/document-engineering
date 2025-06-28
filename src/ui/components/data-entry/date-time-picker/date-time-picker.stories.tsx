import type { Meta, StoryObj } from '@storybook/react'
import { withTimestampsAsISOStrings } from '../../../../scalars/lib/decorators'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types'
import { DateTimePicker } from './date-time-picker.js'
import { FORMAT_MAPPING } from './utils'

/**
 * The `DateTimePicker` component provides an input field for selecting both dates and times.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - dateFormat
 * - timeFormat
 * - timeIntervals
 * - timeZone
 * - showTimezoneSelect
 * - includeContinent
 * - weekStart
 * - autoClose
 * - minDate
 * - maxDate
 * - disablePastDates
 * - disableFutureDates
 *
 * Features include:
 * - Support for both date and time selection in a single component
 * - Customizable date and time formats
 * - Timezone selection and display
 * - Continent information in timezone selection
 * - Automatic timezone detection
 * - Min/Max date restrictions
 * - Past/Future date restrictions
 * - Customizable week start day
 * - Auto-close on selection
 * - Range selection support
 * - Today's date highlighting
 * - Weekday headers
 * - Month navigation
 * - Year view support
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [Date Time Picker Field](?path=/docs/scalars-date-time-picker-field--readme)
 * > component.
 *
 * ## Component Customization
 * The component can be customized using the `className` prop which accepts a string of Tailwind classes.
 * Each class should follow the format `[&_.date-time-picker\\_\\_{element}]:{tailwind-classes}`.
 *
 * ### Date Time Picker Base Classes
 * - .date-time-picker__content: Main content container
 * - .date-time-picker__tabs: Tabs container
 * - .date-time-picker__tabs_svg: Tab icons
 * - .base-picker__input: Input field container
 * - .base-picker__popover: Popover container
 *
 * ### Date Picker Customization
 * For customizing the date picker part, you can use the following classes from the `DatePicker` component:
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
 * - .date-picker__date-footer: Button footer in month and year view
 *
 * > **Note:** For more details about using these Tailwind CSS classes with the `DatePicker` component,
 * > Go to our Storybook docs → 🎨 [Date Picker documentation](?path=/docs/data-entry-date-picker--readme).
 *
 * ### Time Picker Customization
 * For customizing the time picker part, you can use the following classes from the `TimePicker` component:
 * - .time-picker__select: Time select container
 * - .time-picker__option: Time option elements
 * - .time-picker__timezone: Timezone select container
 * - .time-picker__timezone-option: Timezone option elements
 *
 * > **Note:** For more details about using these Tailwind CSS classes with the `TimePicker` component,
 * > Go to our Storybook docs → 🎨 [Time Picker documentation](?path=/docs/data-entry-time-picker--readme).
 *
 * # Example Usage
 *
 * When using Tailwind CSS with custom class names, we need to use `String.raw` because Tailwind
 * interprets underscores (`_`) as class separators. Without `String.raw`, the escape characters don't work
 * properly and you would need to use four backslashes (`\\\\`) to make it work. Using `String.raw` ensures
 * that the class names with underscores are properly escaped and interpreted by Tailwind.
 *
 * Here's an example of how to use the DateTimePicker component with custom classes for styling:
 *
 * ```tsx
 * import { DateTimePicker } from './date-time-picker'
 *
 * function MyCustomDateTimePicker() {
 *   return (
 *     <DateTimePicker
 *       name="custom-date-time"
 *       label="Select Date and Time"
 *       placeholder="YYYY/MM/DD HH:mm"
 *       className={String.raw`
 *         // DateTime Picker customization
 *         [&_.date-time-picker\\_\\_content]:from-cyan-50
 *         [&_.date-time-picker\\_\\_content]:to-blue-50
 *         [&_.date-time-picker\\_\\_content]:rounded-lg
 *         [&_.date-time-picker\\_\\_content]:border-cyan-200
 *         [&_.date-time-picker\\_\\_tabs]:border-cyan-200
 *         [&_.date-time-picker\\_\\_tabs_svg]:text-green-700
 *         [&_.date-time-picker\\_\\_tabs_svg[data-state=active]]:text-green-900
 *
 *         // Date Picker customization
 *         [&_.date-picker\\_\\_button-next]:bg-transparent
 *         [&_.date-picker\\_\\_button-next]:border-2
 *         [&_.date-picker\\_\\_button-next]:border-cyan-400
 *         [&_.date-picker\\_\\_selected]:!bg-cyan-400
 *         [&_.date-picker\\_\\_selected]:!text-white
 *         [&_.date-picker\\_\\_today]:border-2
 *         [&_.date-picker\\_\\_today]:border-cyan-400
 *         [&_.date-picker\\_\\_weekday]:text-cyan-400
 *
 *         // Time Picker customization
 *         [&_.time-picker\\_\\_select]:border-cyan-200
 *         [&_.time-picker\\_\\_select]:rounded-lg
 *         [&_.time-picker\\_\\_option]:text-cyan-700
 *         [&_.time-picker\\_\\_timezone]:border-cyan-200
 *         [&_.time-picker\\_\\_timezone-option]:text-cyan-700
 *       `}
 *     />
 *   )
 * }
 * ```
 *
 */

const meta: Meta<typeof DateTimePicker> = {
  title: 'Data Entry/Date Time Picker',
  component: DateTimePicker,
  tags: ['autodocs'],
  decorators: [withTimestampsAsISOStrings],
  argTypes: {
    ...getDefaultArgTypes({
      enabledArgTypes: {
        value: true,
      },
    }),

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
        defaultValue: { summary: 'hh:mm a' },
        type: {
          summary: 'string',
        },
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
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
  },

  args: {
    name: 'date-time-picker',
  },
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {
  args: {
    name: 'date-time-picker',
    label: 'Date Time Picker Field',
    description: 'This is a date time picker field',
    placeholder: '2025/01/27 12:00',
  },
}

export const WithCustomizedContent: Story = {
  args: {
    name: 'date-time-picker',
    label: 'Customized Content',
    placeholder: '2025/01/27 12:00',
    className: String.raw`
      [&_.date-time-picker\\_\\_content]:rounded-lg
      [&_.date-time-picker\\_\\_content]:border-cyan-200
      [&_.date-time-picker\\_\\_tabs]:border-cyan-200
      [&_.date-time-picker\\_\\_tabs]:[&_button[data-selected=true]]:border-blue-200
      [&_.date-time-picker\\_\\_tabs_svg]:text-green-700
      [&_.date-time-picker\\_\\_tabs_svg[data-state=active]]:text-red-900
      [&_.date-picker\\_\\_calendar]:bg-white
      [&_.date-picker\\_\\_calendar]:rounded-b-lg
      [&_.date-picker\\_\\_calendar_button]:text-gray-700
      [&_.date-picker\\_\\_calendar_button[data-selected=true]]:bg-green-600
      [&_.date-picker\\_\\_calendar_button[data-selected=true]]:text-white
      [&_.date-picker\\_\\_calendar_button[data-selected=true]]:bg-blue-500
      [&_.date-picker\\_\\_button-previous]:bg-transparent
      [&_.date-picker\\_\\_button-previous]:border-2
      [&_.date-picker\\_\\_button-previous]:border-cyan-400
      [&_.date-picker\\_\\_button-next]:bg-transparent
      [&_.date-picker\\_\\_button-next]:border-2
      [&_.date-picker\\_\\_button-next]:border-cyan-400
      [&_.date-time-picker\\_\\_tabs_svg[data-selected=true]]:text-red-600
      [&_.date-time-picker\\_\\_tabs_svg[data-selected=true]]:scale-110
      [&_.date-time-picker\\_\\_tabs_svg[data-selected=true]]:font-bold
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
