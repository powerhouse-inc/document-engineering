import { Icon, type IconName } from '../../../components/icon/index.js'
import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { Select } from './select.js'

/**
 * The `Select` component provides a dropdown selection field.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - placeholder
 * - options
 * - multiple
 * - searchable
 * - selectionIcon
 * - selectionIconPosition
 * - contentAlign
 *
 * Features include:
 * - Single and multiple selection modes
 * - Option icons
 * - Searchable dropdown
 * - Different selection indicators (radio, checkbox, checkmark)
 * - Customizable content alignment
 * - Disabled options support
 *
 * ## Select Customization
 * The select component can be customized using two different props:
 *
 * 1. `className`: Styles for the trigger button and selected item display
 *    - Controls the width, appearance, and layout of the select trigger
 *    - Styles the selected item display in the trigger
 *    - Example: `[&]:!w-[120px]` for fixed width of select trigger
 *
 * 2. `contentClassName`: Styles for the popover content and its elements
 *    - Controls the appearance of the dropdown popover
 *    - Styles the list container, list items, and search input
 *    - Example: `[&_.select\\_\\_content]:!w-[120px]` for fixed width popover
 *
 * Available class patterns for targeting specific elements:
 * - `.select__content`: Dropdown content container
 * - `.select__list`: Options list container
 * - `.select__list-item`: Individual option item
 * - `.select__list-item-favorite`: Favorite option item
 * - `.select__search`: Search input container
 * - `.select__list-item--selected`: Selected item in the list
 *
 * Example of custom styling:
 * ```tsx
 * <Select
 *   className={String.raw`
 *     [&]:!w-[120px]
 *     [&_.select\\_\\_item--selected]:text-green-500
 *   `}
 *   contentClassName={String.raw`
 *     [&_.select\\_\\_content]:!w-[120px]
 *     [&_.select\\_\\_list]:border-2
 *     [&_.select\\_\\_list-item]:text-red-400
 *   `}
 * />
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [EnumField](?path=/docs/scalars-enum-field--readme)
 * > component.
 */

const meta: Meta<typeof Select> = {
  title: 'Data Entry/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    chromatic: {
      disableSnapshot: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', margin: '1rem auto 0' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,

    options: {
      control: 'object',
      description:
        'Array of options to display in the dropdown. These options will be displayed in the order they are provided.',
      table: {
        type: {
          summary:
            'Array<{ value: string; label: string; icon?: IconName | React.ComponentType<{ className?: string }>; disabled?: boolean; }>',
        },
        defaultValue: { summary: '[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    favoriteOptions: {
      control: 'object',
      description:
        'Array of favorite options to display in the dropdown. These options will be displayed at the top of the list.',
      table: {
        type: {
          summary:
            'Array<{ value: string; label: string; icon?: IconName | React.ComponentType<{ className?: string }>; disabled?: boolean; }>',
        },
        defaultValue: { summary: '[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    selectionIcon: {
      control: 'radio',
      options: ['auto', 'checkmark'],
      description:
        'Selection icon to show in the options. ' +
        'auto: Show a Radio for Single Select and a Checkbox for Multi Select. ' +
        'checkmark: Show a checkmark icon for Single and Multi Select. ',
      table: {
        type: { summary: '"auto" | "checkmark"' },
        defaultValue: { summary: '"auto"' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    selectionIconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Selection icon position in options. Only apply if "selectionIcon" is "checkmark".',
      table: {
        type: { summary: '"left" | "right"' },
        defaultValue: { summary: '"left"' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'selectionIcon', eq: 'checkmark' },
    },

    searchable: {
      control: 'boolean',
      description: 'Whether to enable search functionality',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    contentAlign: {
      control: 'select',
      description: 'Alignment of the dropdown',
      options: ['start', 'end', 'center'],
      table: {
        defaultValue: { summary: 'start' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    className: {
      control: 'text',
      description:
        'Custom class name for styling the select trigger button and selected item display. Use [&] selector for the trigger button or [&_.select\\_\\_item--selected] for the selected item.',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    contentClassName: {
      control: 'text',
      description:
        'Custom class name for styling the dropdown content. Can use direct Tailwind classes with [&] selector or target specific elements with [&_.select\\_\\_{element}]',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
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
    baseValue: {
      control: 'object',
      description: 'The base value of the select field',
      table: {
        type: { summary: 'string | string[]' },
        category: StorybookControlCategory.DIFF,
      },
    },
  },
  args: {
    name: 'select',
    errors: [],
    warnings: [],
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof Select>

const IconComponent = (name: IconName): React.ComponentType<{ className?: string }> => {
  const IconComponent = ({ className }: { className?: string }) => <Icon name={name} size={16} className={className} />
  IconComponent.displayName = `IconComponent(${name})`
  return IconComponent
}

const defaultOptions = [
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Drive', label: 'Drive' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Settings', label: 'Settings' },
]

const defaultOptionsWithIcon = [
  {
    value: 'Briefcase',
    label: 'Briefcase',
    icon: IconComponent('Briefcase'),
  },
  {
    value: 'Drive',
    label: 'Drive',
    icon: IconComponent('Drive'),
  },
  {
    value: 'Globe',
    label: 'Globe',
    icon: IconComponent('Globe'),
  },
  {
    value: 'Settings',
    label: 'Settings',
    icon: IconComponent('Settings'),
  },
]

// Basic examples
export const Default: Story = {
  args: {
    label: 'Favorite icon name',
    options: defaultOptions,
    placeholder: 'Select an icon name',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Favorite icon name',
    description: 'Choose your favorite icon name',
    options: defaultOptions,
    placeholder: 'Select an icon name',
  },
}

export const Required: Story = {
  args: {
    label: 'Required field',
    options: defaultOptions,
    placeholder: 'Must select at least one option',
    required: true,
  },
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Preset selection',
    options: defaultOptions,
    placeholder: 'Select an icon name',
    defaultValue: 'Drive',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    options: defaultOptions,
    placeholder: 'Select an icon name',
    value: 'Drive',
    disabled: true,
  },
}

// Validation states
export const WithError: Story = {
  args: {
    label: 'With error',
    options: defaultOptions,
    placeholder: 'Select icon names',
    value: ['Drive'],
    multiple: true,
    errors: ['Please select at least two options'],
  },
}

export const WithWarning: Story = {
  args: {
    label: 'With warning',
    options: defaultOptions,
    placeholder: 'Select icon names',
    value: ['Drive', 'Globe'],
    multiple: true,
    warnings: ['Some selected options may not be available in the future'],
  },
}

// Special features
export const Searchable: Story = {
  args: {
    label: 'Searchable field',
    description: 'Type to search through options',
    options: defaultOptions,
    placeholder: 'Select an icon name',
    searchable: true,
  },
}

export const WithDisabledOption: Story = {
  args: {
    label: 'With disabled option',
    options: [...defaultOptions, { value: 'disabled', label: 'Disabled option', disabled: true }],
    placeholder: 'Select an icon name',
  },
}

export const Multiple: Story = {
  args: {
    label: 'Multi select',
    description: 'You can select multiple options',
    options: defaultOptions,
    placeholder: 'Select icon names',
    multiple: true,
  },
}

export const WithCheckmark: Story = {
  args: {
    label: 'With checkmark',
    description: 'This select shows a checkmark icon for selected option',
    options: defaultOptions,
    selectionIcon: 'checkmark',
    placeholder: 'Select an icon name',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Favorite icon',
    description: 'Choose your favorite icon',
    options: defaultOptionsWithIcon,
    selectionIcon: 'checkmark',
    selectionIconPosition: 'right',
    placeholder: 'Select an icon',
  },
}

export const WithLongOptionLabel: Story = {
  args: {
    label: 'With long option label',
    description: 'The Select handles long option labels',
    options: [
      {
        value: 'very-long-option-1',
        label: 'This is a very long option label that might need truncation in the UI',
      },
      ...defaultOptions,
    ],
    placeholder: 'Select an option',
  },
}

export const WithCustomizedSelect: Story = {
  args: {
    label: 'Customized Select',
    description: 'A select with custom styling for all its elements',
    options: defaultOptionsWithIcon,
    placeholder: 'Select an option',
    selectionIcon: 'checkmark',
    selectionIconPosition: 'right',
    className: String.raw`
    .select__list-item--selected
      [&_.select\\_\\_list-item--selected]:text-green-500
      [&_.select\\_\\_list-item--selected]:[&>div]:text-green-500
      [&_.select\\_\\_list-item--selected]:[&>div]:gap-2
      [&_.select\\_\\_list-item--selected]:[&>svg]:text-green-500
      [&_.select\\_\\list-item--selected]:[&>svg]:size-8
    `,
    contentClassName: String.raw`
    [&_.select\\_\\_content]:border-2
    [&_.select\\_\\_content]:rounded-lg
    [&_.select\\_\\_content]:border-cyan-400/30
    [&_.select\\_\\_content]:bg-white
    [&_.select\\_\\_content]:shadow-lg
    [&_.select\\_\\_list]:border-2
    [&_.select\\_\\_list]:border-red-500
    [&_.select\\_\\_list-item-favorite]:text-red-400
    [&_.select\\_\\_list-item-favorite]:font-bold
    [&_.select\\_\\_list-item-favorite]:cursor-pointer
    [&_.select\\_\\_list-item-favorite]:data-[selected=true]:text-red-900
    [&_.select\\_\\_list-item]:text-red-400
    [&_.select\\_\\_list-item]:font-bold
    [&_.select\\_\\_list-item]:cursor-pointer
    [&_.select\\_\\_list-item]:data-[selected=true]:text-red-900
    [&_.select\\_\\_list-item]:data-[disabled=true]:opacity-50
    [&_.select\\_\\_list-item]:data-[disabled=true]:cursor-not-allowed
    [&_.select\\_\\_list-item]:[&>svg]:text-red-500
    [&_.select\\_\\_list-item]:[&>span]:text-blue-500
    [&_.select\\_\\_search]:text-red-500
    [&_.select\\_\\_search]:[&>svg]:text-red-500
    [&_.select\\_\\_item--selected]:text-red-500
    [&_.select\\_\\_item--selected]:[&>div]:text-red-500
    [&_.select\\_\\_item--selected]:[&>div]:gap-2
    [&_.select\\_\\_item--selected]:[&>svg]:text-red-500
    [&_.select\\_\\_item--selected]:[&>svg]:size-8
  `,
  },
}

export const WithDifferences: Story = {
  args: {
    label: 'Icon names comparison',
    options: defaultOptions,
    value: ['Globe', 'Settings'],
    baseValue: ['Briefcase', 'Drive'],
    multiple: true,
    viewMode: 'mixed',
  },
}
