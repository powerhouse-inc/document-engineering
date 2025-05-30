import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { RadioGroup } from './radio-group.js'

/**
 * The `RadioGroup` component provides a group of radio button options.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - options
 * - required
 * - disabled
 *
 * Features include:
 * - Default value selection
 * - Option descriptions
 * - Disabled options support
 * - Error and warning message display
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [EnumField](?path=/docs/scalars-enum-field--readme)
 * > component.
 */

const meta: Meta<typeof RadioGroup> = {
  title: 'Data Entry/Radio Group',
  component: RadioGroup,
  decorators: [
    (Story) => (
      <div style={{ width: '280px', margin: '1rem auto 0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    chromatic: {
      disableSnapshot: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),

    options: {
      control: 'object',
      description:
        'Array of options with label, value, description, disabled state and className for custom styling of each option',
      table: {
        type: {
          summary:
            'Array<{ label: string; value: string; description?: string; disabled?: boolean; className?: string; }>',
        },
        defaultValue: { summary: '[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    className: {
      control: 'text',
      description: 'Custom css class to style all options in the radio group',
      table: {
        type: { summary: 'string' },
      },
    },

    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
  },
  args: {
    name: 'radio-group',
    errors: [],
    warnings: [],
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof RadioGroup>

const defaultOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

const defaultOptionsWithStyles = [
  { label: 'Option 1', value: '1', className: '[&>label]:text-red-500' },
  { label: 'Option 2', value: '2', className: '[&>label]:text-blue-500' },
  { label: 'Option 3', value: '3', className: '[&>label]:text-green-500' },
]

// Basic examples
export const Default: Story = {
  args: {
    label: 'Radio Group',
    options: defaultOptions,
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Radio Group',
    description: 'This is a helpful description for the Radio Group',
    options: defaultOptions,
  },
}

export const Required: Story = {
  args: {
    label: 'Required Radio Group',
    options: defaultOptions,
    required: true,
  },
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Radio Group with an option selected by default',
    defaultValue: '2',
    options: defaultOptions,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Radio Group',
    disabled: true,
    options: defaultOptions,
    value: defaultOptions[0].value,
  },
}

// Validation states
export const WithError: Story = {
  args: {
    label: 'Radio Group with errors',
    errors: ['Please select an option'],
    options: defaultOptions,
  },
}

export const WithWarning: Story = {
  args: {
    label: 'Radio Group with warnings',
    warnings: ['Your selection may need review'],
    options: defaultOptions,
    defaultValue: '3',
  },
}

// Special features
export const WithDescriptionInOptions: Story = {
  args: {
    label: 'Radio Group with description in options',
    options: [
      {
        label: 'Option 1',
        value: '1',
        description: 'Description for option 1',
      },
      {
        label: 'Option 2',
        value: '2',
        description: 'Description for option 2',
      },
    ],
  },
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Radio Group with disabled options',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2', disabled: true },
      { label: 'Option 3', value: '3' },
      {
        label: 'Option 4',
        value: '4',
        disabled: true,
        description: 'This option is disabled',
      },
    ],
  },
}
export const WithCustomStyles: Story = {
  args: {
    label: 'Radio Group with custom styles',
    options: defaultOptionsWithStyles,
    className: '[&>label]:text-yellow-500 [&_[data-state=checked]_span]:after:!bg-blue-500',
  },
}
