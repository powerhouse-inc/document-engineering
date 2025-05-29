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
 * The calendar can be customized using individual className props for each part of the calendar:
 *
 * - monthsClassName: Styles for the months container
 * - monthCaptionClassName: Styles for the month caption
 * - weekdaysClassName: Styles for the weekdays container
 * - weekdayClassName: Styles for individual weekday
 * - monthClassName: Styles for the month container
 * - buttonNextClassName: Styles for the next button
 * - buttonPreviousClassName: Styles for the previous button
 * - navClassName: Styles for the navigation container
 * - monthGridClassName: Styles for the month grid
 * - weekClassName: Styles for the week container
 * - dayClassName: Styles for the day container
 * - dayButtonClassName: Styles for the day button
 * - rangeStartClassName: Styles for the range start
 * - rangeEndClassName: Styles for the range end
 * - selectedClassName: Styles for selected days
 * - todayClassName: Styles for today's date
 * - outsideClassName: Styles for days outside the current month
 * - disabledClassName: Styles for disabled days
 * - rangeMiddleClassName: Styles for days in the middle of a range
 * - hiddenClassName: Styles for hidden elements
 * - dayPickerClassName: Styles for the day picker container
 *
 * Example usage:
 * \`\`\`tsx
 * <DatePicker
 *   monthsClassName="bg-gray-50"
 *   monthClassName="border-2 border-blue-200"
 *   captionClassName="bg-blue-100"
 *   buttonNextClassName="bg-blue-500 text-white"
 *   buttonPreviousClassName="bg-blue-500 text-white"
 *   selectedClassName="bg-blue-500 text-white"
 *   todayClassName="border-2 border-blue-500"
 * />
 * \`\`\`
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
    className: {
      control: 'text',
      description: 'The clasName for the PopoverContent styles',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    customCalendarClassName: {
      control: 'text',
      description: 'Additional className for the calendar container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    footerButtonClassName: {
      control: 'text',
      description: 'Additional className for the calendar footer button navigation year and month',
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
    monthsClassName: {
      control: 'text',
      description: 'Styles for the months container view days',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    monthCaptionClassName: {
      control: 'text',
      description: 'Styles for the month caption. Example: "[&>div>button>span]:text-green-500"',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    weekdaysClassName: {
      control: 'text',
      description: 'Styles for the weekdays container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    weekdayClassName: {
      control: 'text',
      description: 'Styles for individual weekday',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    monthClassName: {
      control: 'text',
      description: 'Styles for the month container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    buttonNextClassName: {
      control: 'text',
      description: 'Styles for the next button',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    buttonPreviousClassName: {
      control: 'text',
      description: 'Styles for the previous button',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    navClassName: {
      control: 'text',
      description: 'Styles for the navigation container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    monthGridClassName: {
      control: 'text',
      description: 'Styles for the month grid',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    weekClassName: {
      control: 'text',
      description: 'Styles for the week container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    dayClassName: {
      control: 'text',
      description: 'Styles for the day container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    dayButtonClassName: {
      control: 'text',
      description: 'Styles for the day button',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    rangeStartClassName: {
      control: 'text',
      description: 'Styles for the range start',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    rangeEndClassName: {
      control: 'text',
      description: 'Styles for the range end',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    selectedClassName: {
      control: 'text',
      description: 'Styles for selected days',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    todayClassName: {
      control: 'text',
      description: "Styles for today's date",
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    outsideClassName: {
      control: 'text',
      description: 'Styles for days outside the current month',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    disabledClassName: {
      control: 'text',
      description: 'Styles for disabled days',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    rangeMiddleClassName: {
      control: 'text',
      description: 'Styles for days in the middle of a range',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    hiddenClassName: {
      control: 'text',
      description: 'Styles for hidden elements',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    dayPickerClassName: {
      control: 'text',
      description: 'Styles for the day picker container',
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
    monthsClassName: 'bg-gray-50',
    monthClassName: 'hover:border-blue-300 transition-colors',
    captionClassName: 'text-white font-medium py-2 px-4 rounded-t-lg bg-blue-500 border-2 border-blue-200',
    buttonNextClassName: 'bg-white text-blue-600 hover:bg-blue-50 rounded-full p-2 transition-colors',
    buttonPreviousClassName: 'bg-white text-blue-600 hover:bg-blue-50 rounded-full p-2 transition-colors',
    selectedClassName: 'bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors',
    todayClassName: 'border-2 border-blue-400 rounded-full font-medium',
    weekdayClassName: 'text-blue-600 font-medium text-sm',
    dayButtonClassName: 'text-blue-600 hover:text-blue-800 transition-colors',
    outsideClassName: 'bg-red-100',
  },
}
