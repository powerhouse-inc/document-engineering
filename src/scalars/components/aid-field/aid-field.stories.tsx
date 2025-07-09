import type { Meta, StoryObj } from '@storybook/react'
import { fetchOptions, fetchSelectedOption, mockedOptions } from '../../../ui/components/data-entry/aid-input/mocks.js'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { AIDField } from './aid-field.js'

/**
 * ## Autocomplete field component
 *
 * `AIDField` is a specialized form component for handling AIDs (Agent Identifiers) with advanced
 * autocomplete functionality and built-in validation. It allows users to search and select items intuitively
 * as they type.
 *
 * ### Important configs:
 *
 * **1.`fetchOptionsCallback` (for dynamic autocomplete)**
 * - Executes while the user types in the input field
 * - Receives the user's input text as a parameter
 * - Must return a list of options that match the search criteria
 * - Enables real-time search from APIs, databases, or others external or internal data sources
 *
 * **2.`fetchSelectedOptionCallback` (to update the preview of the selected option)**
 * - Called when the "refresh" button in the preview of the selected option is clicked
 * - Receives the selected option's ID/value as a parameter
 * - Must return the updated details of that specific option or undefined if the option is not found for some reason
 * - As `fetchOptionsCallback` can be used synchronously or asynchronously
 *
 * ### Basic usage example:
 *
 * ```tsx
 * <AIDField
 *   name="agent-selector"
 *   label="Select Agent"
 *   placeholder="did:ethr:"
 *   variant="withValueTitleAndDescription"
 *
 *   // search options as the user types
 *   fetchOptionsCallback={async (userInput) => {
 *     const results = await searchAgents(userInput)
 *     return results.map(agent => ({
 *       value: agent.id, // unique agent ID
 *       title: agent.title, // agent title or name
 *       path: agent.path, // agent path or location
 *       description: agent.description, // agent description or summary
 *       agentType: agent.type, // agent type (e.g. "human", "bot", "organization", etc.)
 *       icon: agent.icon // agent icon
 *     }))
 *   }}
 *
 *   // get details of a specific option by its ID/value
 *   fetchSelectedOptionCallback={async (agentId) => {
 *     const agent = await getAgentById(agentId)
 *     return {
 *       value: agent.id,
 *       title: agent.title,
 *       path: agent.path,
 *       description: agent.description,
 *       agentType: agent.type,
 *       icon: agent.icon
 *     }
 *   }}
 * />
 * ```
 */

const meta: Meta<typeof AIDField> = {
  title: 'Scalars/AID Field',
  component: AIDField,
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

    ...getValidationArgTypes(),
  },
  args: {
    name: 'aid-field',
  },
} satisfies Meta<typeof AIDField>

export default meta

type Story = StoryObj<typeof AIDField>

const createCodeExample = (props: Record<string, any>) => {
  const propsString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') return `  ${key}="${value}"`
      if (typeof value === 'boolean') return `  ${key}={${value}}`
      if (value && typeof value === 'object') {
        return `  ${key}={${JSON.stringify(value, null, 4).replace(/\n/g, '\n  ')}}`
      }
      return `  ${key}={${value}}`
    })
    .join('\n')

  return `<AIDField
${propsString}
  // Example definition of fetchOptionsCallback and fetchSelectedOptionCallback functions.
  // Please, note that you should implement your own functions.
  // In this example the functions are async and return a Promise but you can also implement both as sync functions.
  fetchOptionsCallback={async (userInput: string) => {
    // fetch agents from your API endpoint
    const response = await fetch(\`/your-api-endpoint?search=\${userInput}\`)
    const agents = await response.json()
    
    return agents.map(agent => ({
      value: agent.id,
      title: agent.name,
      path: agent.path,
      description: agent.role,
      agentType: agent.type,
      icon: 'Person'
    }))
  }}
  fetchSelectedOptionCallback={async (id: string) => {
    // fetch specific agent details from your API endpoint
    const response = await fetch(\`/your-api-endpoint/\${id}\`)
    if (!response.ok) return undefined
    
    const agent = await response.json()
    return {
      value: agent.id,
      title: agent.name,
      path: agent.path,
      description: agent.role,
      agentType: agent.type,
      icon: 'Person'
    }
  }}
/>`
}

export const Default: Story = {
  args: {
    label: 'AID field',
    placeholder: 'did:ethr:',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field',
          placeholder: 'did:ethr:',
        }),
      },
    },
  },
}

export const Empty: Story = {
  args: {
    label: 'AID field',
    placeholder: 'did:ethr:',
    isOpenByDefault: true,
    defaultValue: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field',
          placeholder: 'did:ethr:',
          isOpenByDefault: true,
          defaultValue: 'did:ethr:',
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const Open: Story = {
  args: {
    label: 'AID field',
    placeholder: 'did:ethr:',
    isOpenByDefault: true,
    defaultValue: 'did:ethr:',
    variant: 'withValueTitleAndDescription',
    initialOptions: mockedOptions,
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field',
          placeholder: 'did:ethr:',
          isOpenByDefault: true,
          defaultValue: 'did:ethr:',
          variant: 'withValueTitleAndDescription',
          initialOptions: mockedOptions,
        }),
      },
    },
  },
}

export const Filled: Story = {
  args: {
    label: 'AID field',
    placeholder: 'did:ethr:',
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field',
          placeholder: 'did:ethr:',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'AID field addition',
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
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field addition',
          placeholder: 'did:ethr:',
          variant: 'withValueTitleAndDescription',
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
        }),
      },
    },
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'AID field removal',
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
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field removal',
          placeholder: 'did:ethr:',
          variant: 'withValueTitleAndDescription',
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
        }),
      },
    },
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'AID field mixed',
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
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'AID field mixed',
          placeholder: 'did:ethr:',
          variant: 'withValueTitleAndDescription',
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
        }),
      },
    },
  },
}
