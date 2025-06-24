import { commonCryptoCurrencies, commonFiatCurrencies } from '../currency-code-picker/defaults.js'
import type { Meta, StoryObj } from '@storybook/react'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { AmountInput } from './index.js'

const mappedFiatCurrencies = commonFiatCurrencies.map((currency) => ({
  ...currency,
  label: currency.ticker,
}))
const mappedCryptoCurrencies = commonCryptoCurrencies.map((currency) => ({
  ...currency,
  label: currency.ticker,
}))

/**
 * The `AmountInput` component provides an input field for entering and selecting monetary amounts.
 * It supports multiple configuration properties like:
 * - label
 * - description
 * - units (currencies)
 * - precision
 * - step
 * - currency position
 *
 * Features include:
 * - Support for both fiat and crypto currencies
 * - Customizable decimal precision
 * - Currency symbol positioning
 * - Min/Max value restrictions
 * - Negative value support
 * - Trailing zeros option
 * - Multiple amount types (Fiat, Crypto, Percentage, etc.)
 *
 * > **Note:** This component does not have built-in validation. If you need built-in validation
 * > you can use the [AmountField](?path=/docs/scalars-amount-field--readme)
 * > component.
 */
const meta = {
  title: 'Data Entry/Amount Input',
  component: AmountInput,
  parameters: {
    layout: 'centered',
    form: {
      defaultValues: {
        'amount-field': {
          amount: undefined,
          unit: '',
        },
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    units: {
      control: 'object',
      description: 'Array of Currency objects',
      table: {
        type: { summary: 'Currency[]' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: {
        arg: 'type',
        neq: 'AmountPercentage',
      },
    },
    includeCurrencySymbols: {
      control: 'boolean',
      description: ' Whether to display currency symbols alongside codes',
      table: {
        defaultValue: { summary: 'true' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: {
        arg: 'type',
        neq: 'AmountPercentage',
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
        arg: 'type',
        neq: 'AmountPercentage',
      },
    },
    step: {
      control: 'number',
      description: 'The step value for the amount field',
      table: {
        defaultValue: { summary: '1' },
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    currencyPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Determines the position of the currency select dropdown relative to the amount input field.',
      table: {
        defaultValue: { summary: 'right' },
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
      if: {
        arg: 'type',
        neq: 'AmountPercentage',
      },
    },

    trailingZeros: {
      control: 'boolean',
      description:
        'When precision is set, for example to 2, determines if the the trailing zeros should be preserved ( for example: 25.00,7.50, etc.) or not ( for example: 25, 7.5).',
      if: {
        arg: 'type',
        neq: 'AmountToken',
      },
      table: {
        type: { summary: 'boolean' },
        category: StorybookControlCategory.VALIDATION,
      },
    },
    viewPrecision: {
      control: 'number',
      description: 'Number of decimal places viewed',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    precision: {
      control: 'number',
      description: 'Number of decimal places viewed',
      table: {
        type: { summary: 'number' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    allowNegative: {
      control: 'boolean',
      description: 'Whether negative values are allowed (true or false).',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },

    numberProps: {
      control: 'object',
      description: 'All the props options for number field',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    selectProps: {
      control: 'object',
      description: 'All the props options for select field',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    ...getDefaultArgTypes(),

    value: {
      control: 'object',
      description:
        "The value of the amount field. Can be a number, an object with currency, or undefined. Examples: { amount: 100, currency: 'USD' }, 200, undefined.",
      table: {
        type: { summary: 'object | number | undefined' },
        category: StorybookControlCategory.DEFAULT,
      },
    },
    ...PrebuiltArgTypes.placeholder,
    ...PrebuiltArgTypes.minValue,
    ...PrebuiltArgTypes.maxValue,
    ...PrebuiltArgTypes.viewMode,
    baseValue: {
      control: 'object',
      description: 'The base value of the amount field.',
      table: {
        type: { summary: 'Amount | AmountFiat | AmountPercentage | AmountCrypto | AmountCurrency' },
        category: StorybookControlCategory.DIFF,
      },
    },
    type: {
      control: 'select',
      options: ['Amount', 'AmountFiat', 'AmountPercentage', 'AmountCrypto', 'AmountCurrency'],
      description: 'The type of amount field.',
      table: {
        type: { summary: 'string' },
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
  },

  args: {
    name: 'amount-field',
  },
} satisfies Meta<typeof AmountInput>

export default meta
type Story = StoryObj<typeof AmountInput>

export const Default: Story = {
  args: {
    placeholder: '0',
    units: mappedFiatCurrencies,
    label: 'Enter Amount and Select Currency',
    placeholderSelect: 'CUR',
    type: 'Amount',
    name: 'amount-field',
    value: {
      amount: undefined,
      unit: '',
    },
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Enter Amount',
    placeholderSelect: 'CUR',
    label: 'Enter Amount',
    type: 'Amount',
    value: {
      amount: 100,
    },
  },
}
export const WithAmount: Story = {
  parameters: {
    form: {
      defaultValues: {
        'amount-field': '',
      },
    },
  },
  args: {
    units: mappedFiatCurrencies,
    placeholder: 'Enter Amount',
    placeholderSelect: 'CUR',
    label: 'Enter Amout ',
    type: 'AmountFiat',
    name: 'amount-field',
    value: {
      amount: 345,
      unit: 'EUR',
    },
  },
}
export const CurrencyIcon: Story = {
  args: {
    units: mappedCryptoCurrencies,
    placeholder: 'Enter Amount',
    label: 'Enter Amount and Select Currency',
    type: 'AmountCrypto',
    placeholderSelect: 'CUR',
    value: {
      amount: 3454564564 as unknown as bigint,
      unit: 'BTC',
    },
  },
}

export const WithToken: Story = {
  parameters: {
    units: mappedCryptoCurrencies,
    form: {
      defaultValues: {
        'amount-field': {
          amount: '',
          unit: '',
        },
      },
    },
  },
  args: {
    placeholder: 'Enter Amount',
    label: 'Enter Amount and Select Currency',
    type: 'AmountCurrency',
    placeholderSelect: 'CUR',
    units: [...mappedCryptoCurrencies, ...mappedFiatCurrencies],
    value: {
      amount: 123 as unknown as bigint,
      unit: 'BTC',
    },
  },
}

export const WithValuePercent: Story = {
  parameters: {
    form: {
      defaultValues: {
        'amount-field': '',
      },
    },
  },
  args: {
    label: 'Enter Percentage ',
    placeholder: 'Enter Amount',
    type: 'AmountPercentage',
    value: 9,
  },
}
export const Disable: Story = {
  args: {
    units: mappedCryptoCurrencies,
    label: 'Enter Amount ',
    placeholder: 'Enter Amount',
    type: 'AmountFiat',
    placeholderSelect: 'CUR',
    disabled: true,
    value: {
      amount: 9,
      unit: 'ETH',
    },
  },
}

export const WithValueUniversalAmountCurrency: Story = {
  parameters: {
    form: {
      defaultValues: {
        'amount-field': {
          amount: 123,
          unit: 'BTC',
        },
      },
    },
  },
  args: {
    units: [...mappedCryptoCurrencies, ...mappedFiatCurrencies],
    label: 'Label',
    placeholder: 'Enter Amount',
    placeholderSelect: 'CUR',
    type: 'AmountCurrency',
    value: {
      amount: 123,
      unit: 'BTC',
    },
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    type: 'AmountFiat',
    units: mappedFiatCurrencies,
    label: 'Icon names addition',
    value: {
      amount: 22233,
      unit: 'USD',
    },
    baseValue: {
      amount: 42323,
      unit: 'THB',
    },
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Icon names removal',
    value: {
      amount: 12323,
      unit: 'ETH',
    },
    baseValue: {
      amount: 413130,
      unit: 'BTC',
    },
    type: 'AmountCurrency',
    units: [...mappedCryptoCurrencies, ...mappedFiatCurrencies],
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Icon names mixed',
    value: {
      amount: 909123223,
      unit: 'BTC',
    },
    baseValue: {
      amount: 49989822,
      unit: 'ETH',
    },
    units: [...mappedCryptoCurrencies, ...mappedFiatCurrencies],
    viewMode: 'mixed',
  },
}
