import type { Meta, StoryObj } from '@storybook/react'
import { withForm } from '../../lib/decorators.js'
import {
  getDefaultArgTypes,
  getValidationArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../lib/storybook-arg-types.js'
import { AmountField } from './amount-field.js'
import { commonFiatCurrencies } from '#ui/components/data-entry/currency-code-picker/index.js'
const mappedFiatCurrencies = commonFiatCurrencies.map((currency) => ({
  ...currency,
  label: currency.ticker,
}))

const meta = {
  title: 'Scalars/Amount Field',
  component: AmountField,
  decorators: [withForm],
  parameters: {
    layout: 'centered',
    form: {
      defaultValues: {
        'amount-field': {
          value: undefined,
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
        type: { summary: 'object' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    selectProps: {
      control: 'object',
      description: 'All the props options for select field',
      table: {
        type: { summary: 'object' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    // TODO:Improve the AmountType descriptions for the value
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
    ...getValidationArgTypes(),
    ...PrebuiltArgTypes.minValue,
    ...PrebuiltArgTypes.maxValue,
    type: {
      control: 'select',
      options: ['Amount', 'AmountFiat', 'AmountPercentage', 'AmountCrypto', 'AmountCurrency'],
      description: 'The type of amount field.',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
    ...PrebuiltArgTypes.viewMode,
    baseValue: {
      control: 'object',
      description: 'The base value of the amount field.',
      table: {
        type: { summary: 'Amount | AmountFiat | AmountPercentage | AmountCrypto | AmountCurrency' },
        category: StorybookControlCategory.DIFF,
      },
    },
  },

  args: {
    name: 'amount-field',
  },
} satisfies Meta<typeof AmountField>

export default meta
type Story = StoryObj<typeof AmountField>

export const Default: Story = {
  args: {
    placeholder: '0',
    units: [...mappedFiatCurrencies],
    label: 'Enter Amount and Select Currency',
    placeholderSelect: 'CUR',
    type: 'Amount',
    value: {
      value: undefined,
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
      value: 100,
    },
  },
}
export const WithAmountFiat: Story = {
  parameters: {
    form: {
      defaultValues: {
        'amount-field': '',
      },
    },
  },
  args: {
    placeholder: 'Enter Amount',
    placeholderSelect: 'CUR',
    label: 'Enter Amout ',
    type: 'AmountFiat',
    value: {
      value: 345,
      unit: 'EUR',
    },
  },
}
export const WithAmountCurrency: Story = {
  args: {
    placeholder: 'Enter Amount',
    label: 'Enter Amount and Select Currency',
    type: 'AmountCurrency',
    placeholderSelect: 'CUR',
    value: {
      value: '3454564564',
      unit: 'DAI',
    },
  },
}

export const WithAmountCrypto: Story = {
  parameters: {
    form: {
      defaultValues: {
        'amount-field': {
          value: '',
          unit: '',
        },
      },
    },
  },
  args: {
    placeholder: 'Enter Amount',
    label: 'Enter Amount and Select Currency',
    type: 'AmountCrypto',
    placeholderSelect: 'CUR',
    value: {
      value: '123',
      unit: 'ETH',
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
    label: 'Enter Amount ',
    placeholder: 'Enter Amount',
    type: 'AmountFiat',
    placeholderSelect: 'CUR',
    disabled: true,
    value: {
      value: 9,
      unit: 'USD',
    },
  },
}

export const WithDifferencesAddition: Story = {
  args: {
    type: 'AmountFiat',
    label: 'Icon names addition',
    placeholderSelect: 'CUR',
    value: {
      value: 22233,
      unit: 'USD',
    },
    baseValue: {
      value: 42323,
      unit: 'THB',
    },
    viewMode: 'addition',
  },
}

export const WithDifferencesRemoval: Story = {
  args: {
    label: 'Icon names removal',
    placeholderSelect: 'CUR',
    value: {
      value: '12323',
      unit: 'ETH',
    },
    baseValue: {
      value: 413130,
      unit: 'BTC',
    },
    type: 'AmountCurrency',
    viewMode: 'removal',
  },
}

export const WithDifferencesMixed: Story = {
  args: {
    label: 'Icon names mixed',
    placeholderSelect: 'CUR',
    value: {
      value: '909123223',
      unit: 'BTC',
    },
    baseValue: {
      value: '49989822',
      unit: 'ETH',
    },
    type: 'AmountCurrency',
    viewMode: 'mixed',
  },
}
