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
 * ## Radio Group Customization
 * The radio group can be customized using the `className` prop which accepts a string of Tailwind classes.
 * Each class should follow the format `[&_.radio-group\\_\\_{element}]:{tailwind-classes}`.
 *
 * Base classes available for customization:
 * - .radio-group: Radio group container
 * - .radio-group__item: Individual radio option container
 *
 * ## Example Usage
 *
 * When using Tailwind CSS with custom class names, we need to use `String.raw` because Tailwind
 * interprets underscores (`_`) as class separators. Without `String.raw`, the escape characters don't work
 * properly and you would need to use four backslashes (`\\\\`) to make it work. Using `String.raw` ensures
 * that the class names with underscores are properly escaped and interpreted by Tailwind.
 *
 * Here's an example of how to use the RadioGroup component with custom classes for styling:
 *
 * ```tsx
 * import { RadioGroup } from './radio-group'
 *
 * function MyCustomRadioGroup() {
 *   return (
 *     <RadioGroup
 *       name="custom-radio"
 *       label="Select an option"
 *       options={[
 *         { label: 'Option 1', value: '1' },
 *         { label: 'Option 2', value: '2' },
 *       ]}
 *       className={String.raw`
 *         [&_.radio-group]:bg-gray-200
 *         [&_.radio-group]:border-2
 *         [&_.radio-group]:border-red-500
 *         [&_.radio-group]:rounded-lg
 *         [&_.radio-group]:shadow-lg
 *         [&_.radio-group]:[&>label]:text-blue-500
 *         [&_.radio-group]:[&>label]:font-semibold
 *
 *         [&_.radio-group\\_\\_item]:text-cyan-400
 *         [&_.radio-group\\_\\_item]:hover:text-cyan-300
 *         [&_.radio-group\\_\\_item]:hover:bg-cyan-400/10
 *         [&_.radio-group\\_\\_item]:rounded-full
 *         [&_.radio-group\\_\\_item]:[&_button[data-state=checked]]:border-cyan-400
 *         [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:!bg-cyan-400
 *         [&_.radio-group\\_\\_item]:[&_label]:text-red-400
 *       `}
 *     />
 *   )
 * }
 * ```
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
    className: String.raw`
      [&.radio-group]:bg-gray-200
      [&.radio-group]:border-2
      [&.radio-group]:border-red-500
      [&.radio-group]:rounded-lg
      [&.radio-group]:shadow-lg
      [&.radio-group]:transition-all
      [&.radio-group]:duration-300
      [&.radio-group]:[&>label]:text-blue-500
      [&.radio-group]:[&>label]:font-semibold

      [&_.radio-group\\_\\_item]:text-cyan-400
      [&_.radio-group\\_\\_item]:hover:text-cyan-300
      [&_.radio-group\\_\\_item]:hover:bg-cyan-400/10
      [&_.radio-group\\_\\_item]:rounded-full
      [&_.radio-group\\_\\_item]:transition-all
      [&_.radio-group\\_\\_item]:duration-300
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]]:border-cyan-400
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]]:hover:border-cyan-500
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:!bg-cyan-400
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:!text-black
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:!font-mono
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:!rounded-full
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:hover:!bg-cyan-500
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:transition-all
      [&_.radio-group\\_\\_item]:[&_button[data-state=checked]_span]:after:duration-300
      [&_.radio-group\\_\\_item]:[&_label]:text-red-400
    `,
  },
}
