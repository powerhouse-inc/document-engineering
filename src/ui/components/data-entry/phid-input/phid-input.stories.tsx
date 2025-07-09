import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { fetchOptions, fetchSelectedOption, mockedOptions } from './mocks.js'
import { PHIDInput } from './phid-input.js'

/**
 * ## Autocomplete input component
 *
 * `PHIDInput` is a specialized input component for handling PHIDs (Powerhouse IDs) with advanced
 * autocomplete functionality. It allows users to search and select items intuitively as they type.
 *
 * ### Key features:
 *
 * **1. Dynamic autocomplete (`fetchOptionsCallback`)**
 * - Executes while the user types in the input field
 * - Receives the user's input text as a parameter
 * - Must return a list of options that match the search criteria
 * - Enables real-time search from APIs, databases, or others external or internal data sources
 *
 * **2. Selected option retrieval (`fetchSelectedOptionCallback`)**
 * - Called when the "refetch" icon in the preview of the selected option is clicked
 * - Receives the selected option's ID/value as a parameter
 * - Must return the updated details of that specific option or undefined if the option is not found for some reason
 * - As `fetchOptionsCallback` can be used synchronously or asynchronously
 *
 * ### Basic usage example:
 *
 * ```tsx
 * <PHIDInput
 *   name="document-selector"
 *   label="Select Document"
 *   placeholder="phd:"
 *   variant="withValueTitleAndDescription"
 *
 *   // search options as the user types
 *   fetchOptionsCallback={async (userInput) => {
 *     const results = await searchDocuments(userInput)
 *     return results.map(doc => ({
 *       value: doc.id, // unique document ID
 *       title: doc.title, // document title or name
 *       path: doc.path, // document path or location
 *       description: doc.description, // document description or summary
 *       icon: doc.icon // document icon
 *     }))
 *   }}
 *
 *   // get details of a specific option by its ID/value
 *   fetchSelectedOptionCallback={async (documentId) => {
 *     const doc = await getDocumentById(documentId)
 *     return {
 *       value: doc.id,
 *       title: doc.title,
 *       path: doc.path,
 *       description: doc.description,
 *       icon: doc.icon
 *     }
 *   }}
 * />
 * ```
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [PHIDField](?path=/docs/scalars-phid-field--readme)
 * > component.
 */

const meta: Meta<typeof PHIDInput> = {
  title: 'Data Entry/PHID Input',
  component: PHIDInput,
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

    allowUris: {
      control: 'boolean',
      description: 'Enables URI format as valid input in the field',
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    allowedScopes: {
      control: 'object',
      description: 'List of allowed scopes.',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: { arg: 'allowUris', eq: true },
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
        'description?: string\n\n',
      table: {
        type: {
          summary:
            '(userInput: string; context?: { allowUris?: boolean; ' +
            'allowedScopes?: string[]; }) => Promise<PHIDOption[]> | PHIDOption[]',
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
        'or undefined if the option is not found',
      table: {
        type: {
          summary: '(value: string) => Promise<PHIDOption | undefined> | PHIDOption | undefined',
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
        type: { summary: 'PHIDOption[]' },
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
        'description?: string\n\n',
      table: {
        type: { summary: 'PHIDOption' },
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
  },
  args: {
    name: 'phid-input',
  },
} satisfies Meta<typeof PHIDInput>

export default meta

type Story = StoryObj<typeof PHIDInput>

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

  return `<PHIDInput
${propsString}
  // Example definition of fetchOptionsCallback and fetchSelectedOptionCallback functions.
  // Please, note that you should implement your own functions.
  // In this example the functions are async and return a Promise but you can also implement both as sync functions.
  fetchOptionsCallback={async (userInput: string) => {
    // fetch documents from your API endpoint
    const response = await fetch(\`/your-api-endpoint?search=\${userInput}\`)
    const documents = await response.json()
    
    return documents.map(document => ({
      value: document.id,
      title: document.title,
      path: document.path,
      description: document.description,
      icon: 'PowerhouseLogoSmall'
    }))
  }}
  fetchSelectedOptionCallback={async (id: string) => {
    // fetch specific document details from your API endpoint
    const response = await fetch(\`/your-api-endpoint/\${id}\`)
    if (!response.ok) return undefined
    
    const document = await response.json()
    return {
      value: document.id,
      title: document.title,
      path: document.path,
      description: document.description,
      icon: 'PowerhouseLogoSmall'
    }
  }}
/>`
}

export const Default: Story = {
  args: {
    label: 'PHID input',
    placeholder: 'phd:',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input',
          placeholder: 'phd:',
        }),
      },
    },
  },
}

export const Empty: Story = {
  args: {
    label: 'PHID input',
    placeholder: 'phd:',
    isOpenByDefault: true,
    defaultValue: 'phd:',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input',
          placeholder: 'phd:',
          isOpenByDefault: true,
          defaultValue: 'phd:',
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const Open: Story = {
  args: {
    label: 'PHID input',
    placeholder: 'phd:',
    isOpenByDefault: true,
    defaultValue: 'phd:',
    initialOptions: mockedOptions,
    allowUris: true,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input',
          placeholder: 'phd:',
          isOpenByDefault: true,
          defaultValue: 'phd:',
          initialOptions: mockedOptions,
          allowUris: true,
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const Filled: Story = {
  args: {
    label: 'PHID input',
    placeholder: 'phd:',
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    allowUris: true,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input',
          placeholder: 'phd:',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          allowUris: true,
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'PHID input addition',
    placeholder: 'phd:',
    allowUris: true,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'addition',
    baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'PowerhouseLogoSmall',
    basePreviewTitle: 'Old Document A',
    basePreviewPath: 'old/projects/finance/document-a',
    basePreviewDescription: 'Old Financial report for Q1 2024',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input addition',
          placeholder: 'phd:',
          allowUris: true,
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'addition',
          baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'PowerhouseLogoSmall',
          basePreviewTitle: 'Old Document A',
          basePreviewPath: 'old/projects/finance/document-a',
          basePreviewDescription: 'Old Financial report for Q1 2024',
        }),
      },
    },
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'PHID input removal',
    placeholder: 'phd:',
    allowUris: true,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'removal',
    baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'PowerhouseLogoSmall',
    basePreviewTitle: 'Old Document A',
    basePreviewPath: 'old/projects/finance/document-a',
    basePreviewDescription: 'Old Financial report for Q1 2024',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input removal',
          placeholder: 'phd:',
          allowUris: true,
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'removal',
          baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'PowerhouseLogoSmall',
          basePreviewTitle: 'Old Document A',
          basePreviewPath: 'old/projects/finance/document-a',
          basePreviewDescription: 'Old Financial report for Q1 2024',
        }),
      },
    },
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'PHID input mixed',
    placeholder: 'phd:',
    allowUris: true,
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'mixed',
    baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'PowerhouseLogoSmall',
    basePreviewTitle: 'Old Document A',
    basePreviewPath: 'old/projects/finance/document-a',
    basePreviewDescription: 'Old Financial report for Q1 2024',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'PHID input mixed',
          placeholder: 'phd:',
          allowUris: true,
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'mixed',
          baseValue: 'phd:abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'PowerhouseLogoSmall',
          basePreviewTitle: 'Old Document A',
          basePreviewPath: 'old/projects/finance/document-a',
          basePreviewDescription: 'Old Financial report for Q1 2024',
        }),
      },
    },
  },
}
