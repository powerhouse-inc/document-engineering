import type { Meta, StoryObj } from '@storybook/react'
import { FORMAT_MAPPING } from '../../../ui/components/data-entry/date-time-picker/utils.js'
import { withForm, withTimestampsAsISOStrings } from '../../lib/decorators.js'
import { getDefaultArgTypes, getValidationArgTypes, StorybookControlCategory } from '../../lib/storybook-arg-types.js'
import { DatePickerField } from './date-picker-field.js'

/**
 * A date picker component designed for form usage with built-in validation.
 *
 * Key features:
 * - Seamless form integration
 * - Input validation out of the box
 * - Customizable styling via Tailwind CSS (className prop)
 * - Date range restrictions (min/max, disable past/future dates)
 *
 * For styling examples and implementation details:
 * See our Storybook docs → 🎨
 * [Date Picker Examples](?path=/docs/data-entry-date-picker--readme)
 *
 * Note: Must be used within a form context provider.
 * Use the `withForm` decorator in Storybook for quick testing.
 */

const meta: Meta<typeof DatePickerField> = {
  title: 'Scalars/Date Picker Field',
  component: DatePickerField,
  parameters: {
    layout: 'centered',
    form: {
      resetBehavior: 'unmount',
    },
  },
  decorators: [withForm, withTimestampsAsISOStrings],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes({
      valueControlType: 'date',
      valueType: 'date',
    }),
    ...getValidationArgTypes(),
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
    viewMode: {
      control: 'select',
      options: ['edition', 'addition', 'removal', 'mixed'],
      defaultValue: 'edition',
      description: 'The mode of the date picker',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DIFF,
      },
    },
    baseValue: {
      control: 'date',
      description: 'The base value of the date picker',
      table: {
        category: StorybookControlCategory.DIFF,
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
      [&_.date-picker\\_\\_calendar]:bg-white
      [&_.date-picker\\_\\_calendar]:rounded-xl

      [&_.date-picker\\_\\_button-next]:bg-white
      [&_.date-picker\\_\\_button-next]:text-gray-700
      [&_.date-picker\\_\\_button-next]:hover:bg-gray-50
      [&_.date-picker\\_\\_button-next]:rounded-full
      [&_.date-picker\\_\\_button-next]:p-2
      [&_.date-picker\\_\\_button-next]:transition-all
      [&_.date-picker\\_\\_button-next]:hover:scale-110
      [&_.date-picker\\_\\_button-next]:shadow-sm

      [&_.date-picker\\_\\_button-previous]:bg-white
      [&_.date-picker\\_\\_button-previous]:text-gray-700
      [&_.date-picker\\_\\_button-previous]:hover:bg-gray-50
      [&_.date-picker\\_\\_button-previous]:rounded-full
      [&_.date-picker\\_\\_button-previous]:p-2
      [&_.date-picker\\_\\_button-previous]:transition-all
      [&_.date-picker\\_\\_button-previous]:hover:scale-110
      [&_.date-picker\\_\\_button-previous]:shadow-sm

      [&_.date-picker\\_\\_selected]:!bg-[#FF5A5F]
      [&_.date-picker\\_\\_selected]:!text-white
      [&_.date-picker\\_\\_selected]:!font-medium
      [&_.date-picker\\_\\_selected]:!rounded-full
      [&_.date-picker\\_\\_selected]:hover:!bg-[#FF5A5F]/90
      [&_.date-picker\\_\\_selected]:transition-all
      [&_.date-picker\\_\\_selected]:shadow-sm

      [&_.date-picker\\_\\_today]:border-2
      [&_.date-picker\\_\\_today]:border-[#FF5A5F]
      [&_.date-picker\\_\\_today]:rounded-full
      [&_.date-picker\\_\\_today]:font-medium

      [&_.date-picker\\_\\_weekday]:text-gray-500
      [&_.date-picker\\_\\_weekday]:font-medium
      [&_.date-picker\\_\\_weekday]:text-sm
      [&_.date-picker\\_\\_weekday]:uppercase
      [&_.date-picker\\_\\_weekday]:tracking-wider

      [&_.date-picker\\_\\_day-button]:text-gray-700
      [&_.date-picker\\_\\_day-button]:hover:text-gray-900
      [&_.date-picker\\_\\_day-button]:hover:bg-gray-50
      [&_.date-picker\\_\\_day-button]:rounded-full
      [&_.date-picker\\_\\_day-button]:transition-all
      [&_.date-picker\\_\\_day-button]:hover:scale-110
      [&_.date-picker\\_\\_day-button]:font-medium
      [&_.date-picker\\_\\_day-button]:w-6
      [&_.date-picker\\_\\_day-button]:h-6
      [&_.date-picker\\_\\_day-button]:flex
      [&_.date-picker\\_\\_day-button]:items-center
      [&_.date-picker\\_\\_day-button]:justify-center

      [&_.date-picker\\_\\_outside]:opacity-30
      [&_.date-picker\\_\\_outside]:!bg-transparent

      [&_.date-picker\\_\\_month-caption]:bg-white
      [&_.date-picker\\_\\_month-caption]:p-2
      [&_.date-picker\\_\\_month-caption]:font-bold
      [&_.date-picker\\_\\_month-caption]:text-gray-900
      [&_.date-picker\\_\\_month-caption]:text-lg
      [&_.date-picker\\_\\_month-caption]:mb-4

      [&_.date-picker\\_\\_month-grid]:gap-1
      [&_.date-picker\\_\\_month-grid]:mt-2

      [&_.date-picker\\_\\_year-grid--view]:border
      [&_.date-picker\\_\\_year-grid--view]:border-gray-100
      [&_.date-picker\\_\\_year-grid--view]:rounded-lg
      [&_.date-picker\\_\\_year-grid--view]:p-2
      [&_.date-picker\\_\\_year-grid--view]:bg-white
      [&_.date-picker\\_\\_year-grid--view]:text-gray-700
      [&_.date-picker\\_\\_year-grid--view]:font-medium
      [&_.date-picker\\_\\_year-grid--view]:hover:bg-gray-50
      [&_.date-picker\\_\\_year-grid--view]:transition-all
      [&_.date-picker\\_\\_year-grid--view]:shadow-sm

      [&_.date-picker\\_\\_month-grid--view]:border
      [&_.date-picker\\_\\_month-grid--view]:border-gray-100
      [&_.date-picker\\_\\_month-grid--view]:rounded-lg
      [&_.date-picker\\_\\_month-grid--view]:p-2
      [&_.date-picker\\_\\_month-grid--view]:bg-white
      [&_.date-picker\\_\\_month-grid--view]:text-gray-700
      [&_.date-picker\\_\\_month-grid--view]:font-medium
      [&_.date-picker\\_\\_month-grid--view]:hover:bg-gray-50
      [&_.date-picker\\_\\_month-grid--view]:transition-all
      [&_.date-picker\\_\\_month-grid--view]:shadow-sm
      [&_.date-picker\\_\\_month-grid--view]:button:text-[#FF5A5F]

      [&_.date-picker\\_\\_date-footer]:gap-2
      [&_.date-picker\\_\\_date-footer]:[&>button]:text-[#FF5A5F]
      [&_.date-picker\\_\\_date-footer]:[&>button]:hover:text-[#FF5A5F]/90
      [&_.date-picker\\_\\_date-footer]:[&>button]:hover:bg-[#FF5A5F]/10
      [&_.date-picker\\_\\_date-footer]:[&>button]:rounded-full
      [&_.date-picker\\_\\_date-footer]:[&>button]:p-2
      [&_.date-picker\\_\\_date-footer]:[&>button]:transition-all
      [&_.date-picker\\_\\_date-footer]:[&>button]:duration-200
      [&_.date-picker\\_\\_date-footer]:[&>button]:font-medium
    `,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    name: 'date',
    label: 'Date Picker Field',
    value: '2025-06-05T11:47:34.000-03:00',
    baseValue: '2024-06-05T11:47:34.000-03:00',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    name: 'date',
    label: 'Date Picker Field',
    value: '2025-06-05T11:47:34.000-03:00',
    baseValue: '2024-06-05T11:47:34.000-03:00',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    name: 'date',
    label: 'Date Picker Field',
    value: '2025-06-05T11:47:34.000-03:00',
    baseValue: '2024-06-05T11:47:34.000-03:00',
    viewMode: 'mixed',
  },
}
