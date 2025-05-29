import React, { useState } from 'react'
import {
  commonCryptoCurrencies,
  commonFiatCurrencies,
} from '../../../../scalars/components/currency-code-field/defaults.js'
import type { Meta, StoryObj } from '@storybook/react'
import { Amount, AmountCrypto, AmountFiat, AmountCurrency, AmountPercentage } from './types.js'
import {
  getDefaultArgTypes,
  PrebuiltArgTypes,
  StorybookControlCategory,
} from '../../../../scalars/lib/storybook-arg-types.js'
import { AmountInput, AmountInputProps } from './amount-input.js'

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
 * > you can use the [AmountField](?path=/docs/document-engineering-scalars-amount-field--readme)
 * > component.
 */
const meta = {
  title: 'Document Engineering/Data Entry/Amount Input',
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
    type: {
      control: 'select',
      options: ['Amount', 'AmountFiat', 'AmountPercentage', 'AmountCrypto', 'AmountCurrency'],
      description: 'The type of amount field.',
      table: {
        type: { summary: 'string' },
        category: StorybookControlCategory.COMPONENT_SPECIFIC,
      },
    },
  },

  args: {
    name: 'amount-field',
  },
} satisfies Meta<typeof AmountInput>

export default meta
type Story = StoryObj<typeof meta>

const AmountInputWrapper = (props: AmountInputProps) => {
  const [value, setValue] = useState<Amount>(props.value as Amount)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as Amount
    setValue(newValue)
  }

  return <AmountInput {...props} type="Amount" value={value} onChange={handleChange} name="amount-field" />
}

type AmountPercentageInputProps = Omit<AmountInputProps, 'units'>

const AmountPercentageInputWrapper = (props: AmountPercentageInputProps) => {
  const [value, setValue] = useState<AmountPercentage>(props.value as AmountPercentage)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as unknown as AmountPercentage
    setValue(newValue)
  }

  return <AmountInput {...props} type="AmountPercentage" value={value} onChange={handleChange} name="amount-field" />
}

const AmountFiatInputWrapper = (props: AmountInputProps) => {
  const [value, setValue] = useState<AmountFiat>(props.value as AmountFiat)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as unknown as AmountFiat
    setValue(newValue)
  }
  return <AmountInput {...props} type="Amount" value={value} onChange={handleChange} name="amount-field" />
}
type AmountCryptoInputProps = Omit<AmountInputProps, 'trailingZeros'>
const AmountCryptoInputWrapper = (props: AmountCryptoInputProps) => {
  const [value, setValue] = useState<AmountCrypto>(props.value as AmountCrypto)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as unknown as AmountCrypto
    setValue(newValue)
  }
  return <AmountInput {...props} type="AmountCrypto" value={value} onChange={handleChange} name="amount-field" />
}

const AmountCurrencyInputWrapper = (props: AmountInputProps) => {
  const [value, setValue] = useState<AmountCurrency>(props.value as AmountCurrency)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as unknown as AmountCurrency
    setValue(newValue)
  }
  return <AmountInput {...props} type="AmountCurrency" value={value} onChange={handleChange} name="amount-field" />
}

export const Default: Story = {
  render: (args: AmountInputProps) => <AmountInputWrapper {...args} />,
  args: {
    placeholder: '0',
    units: mappedFiatCurrencies,
    label: 'Enter Amount and Select Currency',
    placeholderSelect: 'CUR',
    type: 'Amount',
    value: {
      amount: undefined,
      unit: '',
    },
  },
}

export const WithValue: Story = {
  render: (args: AmountInputProps) => <AmountInputWrapper {...args} />,
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
  render: (args: AmountInputProps) => <AmountFiatInputWrapper {...args} />,
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
    value: {
      amount: 345,
      unit: 'EUR',
    },
  },
}
export const CurrencyIcon: Story = {
  render: (args: AmountInputProps) => <AmountCryptoInputWrapper {...args} />,
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
  render: (args: AmountInputProps) => <AmountCurrencyInputWrapper {...args} />,
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
  render: (args: AmountInputProps) => <AmountPercentageInputWrapper {...args} />,
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
  render: (args: AmountInputProps) => <AmountFiatInputWrapper {...args} />,
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
  render: (args: AmountInputProps) => <AmountCurrencyInputWrapper {...args} />,
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
