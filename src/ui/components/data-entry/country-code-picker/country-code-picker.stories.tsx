import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { CountryCodePicker } from './country-code-picker.js'

/**
 * The `CountryCodePicker` component provides a dropdown selection field for country codes.
 *
 * Features include:
 * - Country filtering with allowed/excluded lists
 * - Multiple display modes (codes only, names only, names and codes)
 * - Optional flag icons display
 * - Dependent territories inclusion option
 * - Searchable dropdown functionality
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [CountryCodeField](?path=/docs/scalars-country-code-field--readme)
 * > component.
 */

const meta: Meta<typeof CountryCodePicker> = {
  title: 'Data Entry/Country Code Picker',
  component: CountryCodePicker,
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

    allowedCountries: {
      control: 'object',
      description: 'List of allowed country codes',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    excludedCountries: {
      control: 'object',
      description: 'List of country codes to exclude',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    includeDependentAreas: {
      control: 'boolean',
      description: 'Whether to include dependent territories in country list',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    optionFormat: {
      control: 'radio',
      options: ['CodesOnly', 'NamesOnly', 'NamesAndCodes'],
      description: 'How to display country options in dropdown',
      table: {
        type: { summary: '"CodesOnly" | "NamesOnly" | "NamesAndCodes"' },
        defaultValue: { summary: '"NamesOnly"' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    showFlagIcons: {
      control: 'boolean',
      description: 'Whether to show country flag icons',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    enableSearch: {
      control: 'boolean',
      description: 'Enable search functionality',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    ...PrebuiltArgTypes.baseValue,
  },
  args: {
    name: 'country-code-picker',
    placeholder: 'Select a country',
  },
} satisfies Meta<typeof CountryCodePicker>

export default meta
type Story = StoryObj<typeof CountryCodePicker>

export const Default: Story = {
  args: {
    label: 'Country',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    value: 'FR',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    label: 'Country',
    required: true,
  },
}

export const WithSearchEnabled: Story = {
  args: {
    label: 'Country',
    description: 'Type to search through options',
    enableSearch: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Country',
    value: 'AO',
    errors: ['Please select a different country'],
  },
}

export const WithWarning: Story = {
  args: {
    label: 'Country',
    value: 'AF',
    warnings: ['This country may have restricted access'],
  },
}

export const WithoutFlags: Story = {
  args: {
    label: 'Country',
    description: 'Shows country options without flag icons',
    showFlagIcons: false,
  },
}

export const WithCodesOnly: Story = {
  args: {
    label: 'Country',
    description: 'Shows country codes only',
    optionFormat: 'CodesOnly',
  },
}

export const WithNamesAndCodes: Story = {
  args: {
    label: 'Country',
    description: 'Shows country names and codes',
    optionFormat: 'NamesAndCodes',
  },
}

export const WithDependentAreas: Story = {
  args: {
    label: 'Country',
    description: 'Shows dependent areas',
    includeDependentAreas: true,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Country addition',
    value: 'FR',
    baseValue: 'US',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Country removal',
    value: 'FR',
    baseValue: 'US',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Country mixed',
    value: 'FR',
    baseValue: 'US',
    viewMode: 'mixed',
  },
}
