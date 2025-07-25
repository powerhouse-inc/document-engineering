import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { EnumField } from './enum-field.js'
import { Icon, type IconName } from '../../../ui/components/icon/index.js'

/**
 * A `EnumField` component designed for form usage with built-in validation.
 * It renders a `SelectField` or `RadioGroupField` component.
 *
 * ### Example Usage
 *
 * ```tsx
 * <EnumField
 *   name="favorite-icon"
 *   label="Favorite icon"
 *   placeholder="Choose from the list"
 *   variant="Select"
 *   selectionIcon="checkmark"
 *   options={[
 *     { value: 'Briefcase', label: 'Briefcase' },
 *     { value: 'Drive', label: 'Drive' },
 *     { value: 'Globe', label: 'Globe' },
 *     { value: 'Settings', label: 'Settings' },
 *   ]}
 * />
 * ```
 */

const meta: Meta<typeof EnumField> = {
  title: 'Scalars/Enum Field',
  component: EnumField,
  decorators: [
    withForm,
    (Story) => (
      <div style={{ maxWidth: '280px', margin: '1rem auto 0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,

    variant: {
      control: 'radio',
      options: ['auto', 'RadioGroup', 'Select'],
      description:
        'Enum field variant. ' +
        'auto: uses the most appropriate variant based on the number of options ' +
        '(less than 6 options -> RadioGroup, 6 options or more -> Select). ' +
        'RadioGroup: displays options in a group of radio buttons. ' +
        'Select: displays options in a dropdown menu.',
      table: {
        type: { summary: '"auto" | "RadioGroup" | "Select"' },
        defaultValue: { summary: 'auto' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    options: {
      control: 'object',
      description:
        'Array of options with value, label, icon, description and disabled properties. These options will be displayed in the order they are provided.',
      table: {
        type: {
          summary:
            'Array<{ value: string; label: string; icon?: IconName | React.ComponentType<{ className?: string }>; description?: string; disabled?: boolean; }>',
        },
        defaultValue: { summary: '[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    favoriteOptions: {
      control: 'object',
      description:
        'Array of favorite options with value, label, icon and disabled properties. These options will be displayed at the top of the list.',
      table: {
        type: {
          summary:
            'Array<{ value: string; label: string; icon?: IconName | React.ComponentType<{ className?: string }>; disabled?: boolean; }>',
        },
        defaultValue: { summary: '[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'variant', neq: 'RadioGroup' },
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

    ...getValidationArgTypes(),

    ...PrebuiltArgTypes.viewMode,
    baseValue: {
      control: 'object',
      description: 'The base value of the enum field',
      table: {
        type: { summary: 'string | string[]' },
        category: StorybookControlCategory.DIFF,
      },
    },
  },
  args: {
    name: 'enum-field',
  },
} satisfies Meta<typeof EnumField>

export default meta

type Story = StoryObj<typeof EnumField>

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

interface StoryProps {
  variant: 'auto' | 'RadioGroup' | 'Select'
  [key: string]: unknown
}

export const Default: Story = {
  args: {
    label: 'Select an option',
    options: defaultOptions,
    placeholder: 'Choose from the list',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Select an option',
    description: 'Choose your preferred option from the list',
    variant: 'RadioGroup',
    options: defaultOptions.map((opt, index) => ({
      ...opt,
      description: index === 2 ? `Description for ${opt.label} option` : undefined,
    })),
    placeholder: 'Choose from the list',
  } as StoryProps,
}

export const Required: Story = {
  args: {
    label: 'Required field',
    variant: 'RadioGroup',
    options: defaultOptions,
    placeholder: 'Choose from the list',
    required: true,
  } as StoryProps,
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Preset selection',
    variant: 'RadioGroup',
    options: defaultOptions,
    placeholder: 'Choose from the list',
    defaultValue: 'Drive',
  } as StoryProps,
}

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    variant: 'RadioGroup',
    options: defaultOptions,
    placeholder: 'Choose from the list',
    value: 'Drive',
    disabled: true,
  } as StoryProps,
}

// Validation states
export const WithError: Story = {
  args: {
    label: 'With error',
    variant: 'RadioGroup',
    options: defaultOptions,
    placeholder: 'Choose from the list',
    value: 'Drive',
    errors: ['Please select a different option'],
  } as StoryProps,
}

export const WithWarning: Story = {
  args: {
    label: 'With warning',
    variant: 'RadioGroup',
    options: defaultOptions,
    placeholder: 'Choose from the list',
    value: 'Drive',
    warnings: ['This option may be deprecated soon'],
  } as StoryProps,
}

// Variant examples
export const Select: Story = {
  args: {
    label: 'Select variant',
    variant: 'Select',
    options: defaultOptions,
    placeholder: 'Select an option',
  },
}

export const SelectWithDescription: Story = {
  args: {
    label: 'Select variant with descriptions',
    description: 'Choose your preferred option',
    variant: 'Select',
    options: defaultOptions,
    placeholder: 'Select an option',
  },
}

export const MultiSelect: Story = {
  args: {
    label: 'Multi Select variant',
    variant: 'Select',
    options: defaultOptions,
    placeholder: 'Select options',
    multiple: true,
  },
}

export const SearchableSelect: Story = {
  args: {
    label: 'Searchable select variant',
    variant: 'Select',
    options: defaultOptions,
    placeholder: 'Search and select an option',
    searchable: true,
  },
}

export const SelectWithCheckmark: Story = {
  args: {
    label: 'With checkmark',
    description: 'Shows a checkmark for selected options',
    variant: 'Select',
    options: defaultOptions,
    selectionIcon: 'checkmark',
    placeholder: 'Select an icon name',
  },
}

export const SelectWithIcon: Story = {
  args: {
    label: 'Favorite icon',
    description: 'Choose your favorite icon',
    variant: 'Select',
    options: defaultOptionsWithIcon,
    selectionIcon: 'checkmark',
    selectionIconPosition: 'right',
    placeholder: 'Select an icon',
  },
}

export const WithCustomStylesSelect: Story = {
  args: {
    label: 'Favorite icon',
    description: 'Choose your favorite icon',
    variant: 'Select',
    options: defaultOptionsWithIcon,
    selectionIcon: 'checkmark',
    selectionIconPosition: 'right',
    placeholder: 'Select an icon',
  },
}
export const WithCustomStylesRadioGroup: Story = {
  args: {
    label: 'Favorite icon',
    description: 'Choose your favorite icon',
    options: defaultOptions,
    selectionIcon: 'checkmark',
    selectionIconPosition: 'right',
    className:
      '[&>label]:text-red-900 [&_label]:text-blue-600 [&_label]:hover:text-green-600 [&_button]:border-blue-600 [&_button]:hover:border-green-600 [&_[data-state=checked]_span]:after:!bg-red-500',
  },
}

// Differences examples
export const WithDifferencesAddition: Story = {
  args: {
    label: 'Icon names addition',
    variant: 'Select',
    options: defaultOptions,
    value: ['Globe', 'Settings'],
    baseValue: ['Briefcase', 'Drive'],
    multiple: true,
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Icon names removal',
    variant: 'Select',
    options: defaultOptions,
    value: ['Globe', 'Settings'],
    baseValue: ['Briefcase', 'Drive'],
    multiple: true,
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Icon names mixed',
    variant: 'Select',
    options: defaultOptions,
    value: ['Globe', 'Settings'],
    baseValue: ['Briefcase', 'Drive'],
    multiple: true,
    viewMode: 'mixed',
  },
}
