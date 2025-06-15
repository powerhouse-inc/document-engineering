import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { UrlInput } from './url-input.js'

/**
 * The `UrlInput` component provides an input field for web URLs.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - platformIcons
 * - showWarnings
 *
 * Features include:
 * - Platform-specific icons for known websites
 * - Automatic URL warnings
 * - Trailing space trimming
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [UrlField](?path=/docs/scalars-url-field--readme)
 * > component.
 */

const meta: Meta<typeof UrlInput> = {
  title: 'Data Entry/Url Input',
  component: UrlInput,
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
    ...PrebuiltArgTypes.placeholder,

    showWarnings: {
      control: 'boolean',
      description: 'Controls whether warnings are displayed to the user',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    platformIcons: {
      control: 'object',
      description: 'An object where the key is the hostname and the value is the icon name or a React element',
      table: {
        type: { summary: 'Record<string, IconName | ReactElement>' },
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
    name: 'url-input',
  },
}

export default meta
type Story = StoryObj<typeof UrlInput>

export const Default: Story = {
  args: {
    label: 'Website URL',
    placeholder: 'https://example.com',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Forum URL',
    description: 'Enter the URL to your online forum',
    placeholder: 'https://myforum.com',
  },
}

export const Required: Story = {
  args: {
    label: 'LinkedIn',
    required: true,
    placeholder: 'https://linkedin.com/in/username',
  },
}

export const WithDefaultValue: Story = {
  args: {
    label: 'With Default Value',
    defaultValue: 'https://example.com',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Read Only URL',
    defaultValue: 'https://example.com',
    disabled: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Website URL',
    defaultValue: 'not-a-valid-url',
    errors: ['Please enter a valid URL'],
  },
}

export const WithWarning: Story = {
  args: {
    label: 'Website URL',
    defaultValue: 'https://example.com',
    warnings: ['URL may be unreachable'],
  },
}

export const WithPlatformIcon: Story = {
  args: {
    label: 'Website URL',
    defaultValue: 'https://github.com/test',
    platformIcons: {
      'github.com': 'Github',
      'linkedin.com': 'Linkedin',
      'twitter.com': 'XTwitter',
      'x.com': 'XTwitter',
      'youtube.com': 'Youtube',
      'forum.sky.money': 'Forum',
      'discord.com': 'Discord',
      'discord.gg': 'Discord',
    },
  },
}
