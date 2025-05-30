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
      description: 'Array of options to display in the select',
      table: {
        type: {
          summary:
            'Array<{ value: string; label: string; icon?: IconName | React.ComponentType<{ className?: string }>; disabled?: boolean; className?: string }>',
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

    contentClassName: {
      control: 'text',
      description: 'Custom class name for the dropdown content',
      table: {
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    optionsClassName: {
      control: 'text',
      description: 'Custom class name for the options',
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
    diffMode: {
      control: 'select',
      description: 'The mode of the input field',
      options: ['sentences'],
      table: {
        type: { summary: 'sentences' },
        defaultValue: { summary: 'sentences' },
        category: StorybookControlCategory.DIFF,
      },
    },
    ...PrebuiltArgTypes.baseValue,
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

const defaultOptionsWithColors = [
  { value: 'Briefcase', label: 'Briefcase', className: '[&>span]:text-red-900' },
  { value: 'Drive', label: 'Drive', className: '[&>span]:text-blue-900' },
  { value: 'Globe', label: 'Globe', className: '[&>span]:text-yellow-900' },
  { value: 'Settings', label: 'Settings', className: '[&>span]:text-green-900' },
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

export const WithCustomColors: Story = {
  args: {
    label: 'Favorite icon name',
    options: defaultOptionsWithColors,
    placeholder: 'Select an icon name',
  },
}
