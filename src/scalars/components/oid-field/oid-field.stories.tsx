import type { Meta, StoryObj } from '@storybook/react'
import { fetchOptions, fetchSelectedOption, mockedOptions } from '../../../ui/components/data-entry/oid-input/mocks.js'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { OIDField } from './oid-field.js'

/**
 * ## Autocomplete field component
 *
 * `OIDField` is a specialized form component for handling OIDs (Object Identifiers) with advanced
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
 * <OIDField
 *   name="object-selector"
 *   label="Select Object"
 *   placeholder="uuid"
 *   variant="withValueTitleAndDescription"
 *
 *   // search options as the user types
 *   fetchOptionsCallback={async (userInput) => {
 *     const results = await searchObjects(userInput)
 *     return results.map(obj => ({
 *       value: obj.id, // unique object ID
 *       title: obj.title, // object title or name
 *       path: obj.path, // object path or location
 *       description: obj.description, // object description or summary
 *       icon: obj.icon // object icon
 *     }))
 *   }}
 *
 *   // get details of a specific option by its ID/value
 *   fetchSelectedOptionCallback={async (objectId) => {
 *     const obj = await getObjectById(objectId)
 *     return {
 *       value: obj.id,
 *       title: obj.title,
 *       path: obj.path,
 *       description: obj.description,
 *       icon: obj.icon
 *     }
 *   }}
 * />
 * ```
 */

const meta: Meta<typeof OIDField> = {
  title: 'Scalars/OID Field',
  component: OIDField,
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
          summary: '(userInput: string; context?: {}) => Promise<OIDOption[]> | OIDOption[]',
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
          summary: '(value: string) => Promise<OIDOption | undefined> | OIDOption | undefined',
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
        type: { summary: 'OIDOption[]' },
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
        type: { summary: 'OIDOption' },
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

    ...getValidationArgTypes(),
  },
  args: {
    name: 'oid-field',
  },
} satisfies Meta<typeof OIDField>

export default meta

type Story = StoryObj<typeof OIDField>

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

  return `<OIDField
${propsString}
  // Example definition of fetchOptionsCallback and fetchSelectedOptionCallback functions.
  // Please, note that you should implement your own functions.
  // In this example the functions are async and return a Promise but you can also implement both as sync functions.
  fetchOptionsCallback={async (userInput: string) => {
    // fetch objects from your API endpoint
    const response = await fetch(\`/your-api-endpoint?search=\${userInput}\`)
    const objects = await response.json()
    
    return objects.map(object => ({
      value: object.id,
      title: object.name,
      path: object.path,
      description: object.description,
      icon: 'Braces'
    }))
  }}
  fetchSelectedOptionCallback={async (id: string) => {
    // fetch specific object details from your API endpoint
    const response = await fetch(\`/your-api-endpoint/\${id}\`)
    if (!response.ok) return undefined
    
    const object = await response.json()
    return {
      value: object.id,
      title: object.name,
      path: object.path,
      description: object.description,
      icon: 'Braces'
    }
  }}
/>`
}

export const Default: Story = {
  args: {
    label: 'OID field',
    placeholder: 'uuid',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field',
          placeholder: 'uuid',
        }),
      },
    },
  },
}

export const Empty: Story = {
  args: {
    label: 'OID field',
    placeholder: 'uuid',
    isOpenByDefault: true,
    defaultValue: 'uuid',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field',
          placeholder: 'uuid',
          isOpenByDefault: true,
          defaultValue: 'uuid',
          variant: 'withValueTitleAndDescription',
        }),
      },
    },
  },
}

export const Open: Story = {
  args: {
    label: 'OID field',
    placeholder: 'uuid',
    isOpenByDefault: true,
    defaultValue: 'uuid',
    variant: 'withValueTitleAndDescription',
    initialOptions: mockedOptions,
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field',
          placeholder: 'uuid',
          isOpenByDefault: true,
          defaultValue: 'uuid',
          variant: 'withValueTitleAndDescription',
          initialOptions: mockedOptions,
        }),
      },
    },
  },
}

export const Filled: Story = {
  args: {
    label: 'OID field',
    placeholder: 'uuid',
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
          label: 'OID field',
          placeholder: 'uuid',
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
    label: 'OID field addition',
    placeholder: 'uuid',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'addition',
    baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'Braces',
    basePreviewTitle: 'Old Object A',
    basePreviewPath: 'old-rwa-portfolio-a',
    basePreviewDescription: 'Old Object A description',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field addition',
          placeholder: 'uuid',
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'addition',
          baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'Braces',
          basePreviewTitle: 'Old Object A',
          basePreviewPath: 'old-rwa-portfolio-a',
          basePreviewDescription: 'Old Object A description',
        }),
      },
    },
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'OID field removal',
    placeholder: 'uuid',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'removal',
    baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'Braces',
    basePreviewTitle: 'Old Object A',
    basePreviewPath: 'old-rwa-portfolio-a',
    basePreviewDescription: 'Old Object A description',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field removal',
          placeholder: 'uuid',
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'removal',
          baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'Braces',
          basePreviewTitle: 'Old Object A',
          basePreviewPath: 'old-rwa-portfolio-a',
          basePreviewDescription: 'Old Object A description',
        }),
      },
    },
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'OID field mixed',
    placeholder: 'uuid',
    variant: 'withValueTitleAndDescription',
    fetchOptionsCallback: fetchOptions,
    fetchSelectedOptionCallback: fetchSelectedOption,
    defaultValue: mockedOptions[0].value,
    initialOptions: mockedOptions,
    viewMode: 'mixed',
    baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
    basePreviewIcon: 'Braces',
    basePreviewTitle: 'Old Object A',
    basePreviewPath: 'old-rwa-portfolio-a',
    basePreviewDescription: 'Old Object A description',
  },
  parameters: {
    docs: {
      source: {
        code: createCodeExample({
          label: 'OID field mixed',
          placeholder: 'uuid',
          variant: 'withValueTitleAndDescription',
          defaultValue: mockedOptions[0].value,
          initialOptions: mockedOptions,
          viewMode: 'mixed',
          baseValue: 'abcde2a4-f9a0-4950-8161-fd8d8cc7dea7',
          basePreviewIcon: 'Braces',
          basePreviewTitle: 'Old Object A',
          basePreviewPath: 'old-rwa-portfolio-a',
          basePreviewDescription: 'Old Object A description',
        }),
      },
    },
  },
}
