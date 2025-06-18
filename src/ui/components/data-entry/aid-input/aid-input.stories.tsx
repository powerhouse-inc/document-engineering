import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { AIDInput } from './aid-input.js'
import { fetchOptions, fetchSelectedOption, mockedOptions } from './mocks.js'

/**
 * The `AIDInput` component provides an input field for Agent IDs (typically DIDs).
 *
 * Features include:
 * - Multiple display variants for autocomplete options
 * - Copy paste support
 * - Async and sync options fetching
 * - Customizable preview placeholder with icon, title, path, description and agent type
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [AIDField](?path=/docs/scalars-aid-field--readme)
 * > component.
 */

const meta: Meta<typeof AIDInput> = {
  title: 'Data Entry/AID Input',
  component: AIDInput,
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
    ...getValidationArgTypes({
      enabledArgTypes: {
        validators: false,
        showErrorOnBlur: false,
        showErrorOnChange: false,
      },
    }),
    ...PrebuiltArgTypes.placeholder,
    ...PrebuiltArgTypes.maxLength,

    supportedNetworks: {
      control: 'object',
      description:
        'List of supported networks for DID validation. Network interface: { chainId: string; name?: string; }',
      table: {
        type: { summary: 'Network[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    autoComplete: {
      control: 'boolean',
      description: 'Enables autocomplete functionality to suggest options while typing',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    fetchOptionsCallback: {
      control: 'object',
      description:
        'Function to fetch options based on user input and context. ' +
        'Must return a Promise that resolves to an array of objects or an array of objects with the following properties:\n\n' +
        'icon?: IconName | React.ReactElement\n\n' +
        'title?: string\n\n' +
        'path?: string | { text: string; url: string; }\n\n' +
        'value: string\n\n' +
        'description?: string\n\n' +
        'agentType?: string\n\n',
      table: {
        type: {
          summary:
            '(userInput: string; context?: { supportedNetworks?: Network[]; }) => Promise<AIDOption[]> | AIDOption[]',
        },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        readonly: true,
      },
      if: { arg: 'autoComplete', neq: false },
    },

    fetchSelectedOptionCallback: {
      control: 'object',
      description:
        'Function to fetch details for a selected option. ' +
        'Must return a Promise that resolves to an object or an object with the following properties:\n\n' +
        'icon?: IconName | React.ReactElement\n\n' +
        'title?: string\n\n' +
        'path?: string | { text: string; url: string; }\n\n' +
        'value: string\n\n' +
        'description?: string\n\n' +
        'agentType?: string\n\n' +
        'or undefined if the option is not found',
      table: {
        type: {
          summary: '(value: string) => Promise<AIDOption | undefined> | AIDOption | undefined',
        },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
        readonly: true,
      },
      if: { arg: 'autoComplete', neq: false },
    },

    initialOptions: {
      control: 'object',
      description: 'Array of options to initially populate the autocomplete dropdown',
      table: {
        type: { summary: 'AIDOption[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'autoComplete', neq: false },
    },

    previewPlaceholder: {
      control: 'object',
      description:
        'Custom placeholder values to show when no option is selected or when there are no matching options. ' +
        'Can include custom values for:\n\n' +
        'icon?: IconName | React.ReactElement\n\n' +
        'title?: string\n\n' +
        'path?: string | { text: string; url: string; }\n\n' +
        'value: string\n\n' +
        'description?: string\n\n' +
        'agentType?: string\n\n',
      table: {
        type: { summary: 'AIDOption' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'autoComplete', neq: false },
    },

    variant: {
      control: 'radio',
      options: ['withValue', 'withValueAndTitle', 'withValueTitleAndDescription'],
      description:
        'Controls the amount of information displayed for each option: value only, value with title, or value with title and description',
      table: {
        type: {
          summary: '"withValue" | "withValueAndTitle" | "withValueTitleAndDescription"',
        },
        defaultValue: { summary: 'withValue' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'autoComplete', neq: false },
    },

    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
    basePreviewIcon: {
      control: 'object',
      description: 'The icon of the base preview',
      table: {
        type: { summary: 'IconName | React.ReactElement' },
        category: StorybookControlCategory.DIFF,
      },
    },
    basePreviewTitle: {
      control: 'text',
      description: 'The title of the base preview',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DIFF,
      },
    },
    basePreviewPath: {
      control: 'object',
      description: 'The path of the base preview',
      table: {
        type: { summary: 'string | { text: string; url: string; }' },
        category: StorybookControlCategory.DIFF,
      },
    },
    basePreviewDescription: {
      control: 'text',
      description: 'The description of the base preview',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DIFF,
      },
    },
    basePreviewAgentType: {
      control: 'text',
      description: 'The agent type of the base preview',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.DIFF,
      },
    },
  },
  args: {
    name: 'aid-input',
  },
} satisfies Meta<typeof AIDInput>

export default meta

type Story = StoryObj<typeof AIDInput>

export const Default: Story = {
  args: {
    label: 'AID input',
    placeholder: 'did:ethr:',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
}

export const Empty: Story = {
  args: {
    label: 'AID input',
    placeholder: 'did:ethr:',
    isOpenByDefault: true,
    defaultValue: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
}

export const Open: Story = {
  args: {
    label: 'AID input',
    placeholder: 'did:ethr:',
    isOpenByDefault: true,
    defaultValue: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    initialOptions: mockedOptions,
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
}

export const Filled: Story = {
  args: {
    label: 'AID input',
    placeholder: 'did:ethr:',
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'AID input addition',
    placeholder: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'addition',
    baseValue: 'did:ethr:0xabcde14089478a327f09197987f16f9e5d936e8a',
    basePreviewIcon: 'Person',
    basePreviewTitle: 'Old Agent A',
    basePreviewPath: {
      text: 'old-renown.id/0xb9c5714089478a327f09197987f16f9e5d936e8a',
      url: 'https://www.old-renown.id/',
    },
    basePreviewDescription: 'Old Agent A description',
    basePreviewAgentType: 'Old Human Contributor',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'AID input removal',
    placeholder: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'removal',
    baseValue: 'did:ethr:0xabcde14089478a327f09197987f16f9e5d936e8a',
    basePreviewIcon: 'Person',
    basePreviewTitle: 'Old Agent A',
    basePreviewPath: {
      text: 'old-renown.id/0xb9c5714089478a327f09197987f16f9e5d936e8a',
      url: 'https://www.old-renown.id/',
    },
    basePreviewDescription: 'Old Agent A description',
    basePreviewAgentType: 'Old Human Contributor',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'AID input mixed',
    placeholder: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'mixed',
    baseValue: 'did:ethr:0xabcde14089478a327f09197987f16f9e5d936e8a',
    basePreviewIcon: 'Person',
    basePreviewTitle: 'Old Agent A',
    basePreviewPath: {
      text: 'old-renown.id/0xb9c5714089478a327f09197987f16f9e5d936e8a',
      url: 'https://www.old-renown.id/',
    },
    basePreviewDescription: 'Old Agent A description',
    basePreviewAgentType: 'Old Human Contributor',
  },
}
