import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { CurrencyCodePicker } from './currency-code-picker.js'

/**
 * The `CurrencyCodePicker` component provides a dropdown selection field for currency codes.
 *
 * Features include:
 * - Support for both fiat and crypto currencies
 * - Favorite currencies displayed at the top
 * - Currency symbol display with customizable positioning
 * - Searchable dropdown option
 * - Default filtering by currency type (Fiat, Crypto, Both)
 * - Custom currency list or default currencies
 * - Content alignment options
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [CurrencyCodeField](?path=/docs/scalars-currency-code-field--readme)
 * > component.
 */

const meta: Meta<typeof CurrencyCodePicker> = {
  title: 'Data Entry/Currency Code Picker',
  component: CurrencyCodePicker,
  parameters: {
    layout: 'padded',
    chromatic: {
      disableSnapshot: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '192px', margin: '1rem auto 0' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    ...getDefaultArgTypes(),
    ...PrebuiltArgTypes.placeholder,

    currencies: {
      control: 'object',
      description: `Array of Currency objects. Each Currency object has:<br/>

**Required fields:**
- \`ticker\`: string - The currency ticker/symbol (e.g., "USD", "BTC", "ETH")
- \`crypto\`: boolean - Whether this is a cryptocurrency (true) or fiat currency (false) <br/><br/>

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
    name: 'currency-code-picker',
    placeholder: 'Select a currency',
    favoriteCurrencies: [],
    currencies: [],
  },
}

export default meta
type Story = StoryObj<typeof CurrencyCodePicker>

export const Default: Story = {
  args: {
    label: 'Currency',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Currency',
    defaultValue: 'EUR',
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
