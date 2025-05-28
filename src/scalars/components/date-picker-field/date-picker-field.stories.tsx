import type { Meta, StoryObj } from '@storybook/react'
import { FORMAT_MAPPING } from '../../../ui/components/data-entry/date-time-picker/utils.js'
import { withForm, withTimestampsAsISOStrings } from '../../lib/decorators.js'
import { getDefaultArgTypes, getValidationArgTypes, StorybookControlCategory } from '../../lib/storybook-arg-types.js'
import { DatePickerField } from './date-picker-field.js'

const meta: Meta<typeof DatePickerField> = {
  title: 'Document Engineering/Scalars/Date Field',
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
    monthsClassName: {
      control: 'text',
      description: 'Styles for the months container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    monthCaptionClassName: {
      control: 'text',
      description: 'Styles for the month caption',
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
    captionClassName: {
      control: 'text',
      description: 'Styles for the caption container',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_CUSTOMIZATION,
      },
    },
    captionLabelClassName: {
      control: 'text',
      description: 'Styles for the caption label',
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

export const CustomizedCalendar: Story = {
  args: {
    name: 'date',
    label: 'Customized Calendar',
    // placeholder: '2025/01/27',
    // monthsClassName: 'bg-gray-50',
    // monthClassName: 'border-2 border-blue-200',
    // captionClassName: 'bg-blue-100',
    // buttonNextClassName: 'bg-blue-500 text-white',
    // buttonPreviousClassName: 'bg-blue-500 text-white',
    // selectedClassName: 'bg-blue-500 text-white',
    // todayClassName: 'border-2 border-green-500 bg-green-100',
    // outsideClassName: 'bg-red-100',
  },
}
