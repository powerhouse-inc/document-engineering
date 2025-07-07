import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { CurrencyCodeField } from './currency-code-field.js'

const meta: Meta<typeof CurrencyCodeField> = {
  title: 'Scalars/Currency Code Field',
  component: CurrencyCodeField,
  decorators: [withForm, (Story) => <div className="w-48">{Story()}</div>],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,
    ...getValidationArgTypes(),

    currencies: {
      control: 'object',
      description: `Array of Currency objects. Each Currency object has:<br/>

**Required fields:**
- \`ticker\`: string - The currency ticker/symbol (e.g., "USD", "BTC", "ETH")
- \`crypto\`: boolean - Whether this is a cryptocurrency (true) or fiat currency (false)<br/><br/>

**Optional fields:**

- \`label\`: string - Display label for the currency (e.g., "US Dollar", "Bitcoin")
- \`symbol\`: string - Currency symbol (e.g., "$", "€", "₿")
- \`icon\`: IconName | React.ComponentType - Icon to display for the currency`,
      table: {
        type: { summary: 'Currency[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    includeCurrencySymbols: {
      control: 'boolean',
      description: ' Whether to display currency symbols alongside codes',
      table: {
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    favoriteCurrencies: {
      control: 'object',
      description: 'List of currencies to display at the top of the dropdown for quick access',
      table: {
        type: { summary: 'string[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    symbolPosition: {
      control: 'select',
      description: 'Position of the currency symbol',
      options: ['left', 'right'],
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: {
        arg: 'includeCurrencySymbols',
        eq: true,
      },
    },
    allowedTypes: {
      control: 'select',
      description: 'Allowed types of currencies to display when no currencies are provided',
      options: ['Fiat', 'Crypto', 'Both'],
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    searchable: {
      control: 'boolean',
      description: 'Whether the dropdown is searchable',
      table: {
        defaultValue: { summary: 'false' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    ...PrebuiltArgTypes.viewMode,
    ...PrebuiltArgTypes.baseValue,
  },

  args: {
    name: 'currency-code-field',
    placeholder: 'Select a currency',
    favoriteCurrencies: [],
    currencies: [],
  },
}

export default meta
type Story = StoryObj<typeof CurrencyCodeField>

export const Default: Story = {
  args: {
    label: 'Currency',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Currency',
    value: 'EUR',
    disabled: true,
    allowedTypes: 'Fiat',
  },
}

export const WithFavorites: Story = {
  args: {
    label: 'Currency',
    currencies: [
      {
        ticker: 'BTC',
        crypto: true,
        label: 'Bitcoin',
        symbol: '₿',
      },
      {
        ticker: 'ETH',
        crypto: true,
        label: 'Ether',
        symbol: 'Ξ',
      },
      {
        ticker: 'USDS',
        crypto: true,
        label: 'Sky USD',
        symbol: 'USDS',
      },
      {
        ticker: 'USDC',
        crypto: true,
        icon: 'Briefcase',
      },
    ],
    favoriteCurrencies: ['BTC', 'ETH'],
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    label: 'Currency addition',
    value: 'DAI',
    baseValue: 'ETH',
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Currency removal',
    value: 'DAI',
    baseValue: 'ETH',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Currency mixed',
    value: 'DAI',
    baseValue: 'ETH',
    viewMode: 'mixed',
  },
}
