import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'
import { z } from 'zod'
export const NUMERIC_VALUE_REGEX = /^\d+(\.\d+)?$/

export type SupportedCurrency = string

export interface AmountCurrency {
  unit: SupportedCurrency
  value: string
}

export interface ScalarType {
  input: AmountCurrency
  output: AmountCurrency
}

export const type = '{ unit: string, value: string }'

export const typedef = 'scalar Amount_Currency'

export const schema = z.object({
  unit: z.string(),
  value: z.string(),
})

export const stringSchema = 'z.object({ unit: z.string(), value: z.string()})'

const amountCurrencyValidation = (value: unknown): AmountCurrency => {
  if (typeof value !== 'object' || !value) {
    throw new GraphQLError(`Invalid Amount Currency value: ${JSON.stringify(value)}`)
  }

  const result = schema.safeParse(value)

  if (result.success) return result.data
  throw new GraphQLError(result.error.message)
}

export const config: GraphQLScalarTypeConfig<AmountCurrency, AmountCurrency> = {
  name: 'Amount_Currency',
  description: 'A custom scalar that represents a currency amount with its currency type',
  serialize: amountCurrencyValidation,
  parseValue: amountCurrencyValidation,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.OBJECT) {
      throw new GraphQLError('Value must be an object', { nodes: ast })
    }

    const unitField = ast.fields.find((f) => f.name.value === 'unit')
    const valueField = ast.fields.find((f) => f.name.value === 'value')

    if (!unitField || unitField.value.kind !== Kind.STRING) {
      throw new GraphQLError('unit must be a valid string value', {
        nodes: ast,
      })
    }

    if (!valueField || valueField.value.kind !== Kind.STRING) {
      throw new GraphQLError('value must be a valid string value', {
        nodes: ast,
      })
    }

    if (!NUMERIC_VALUE_REGEX.test(valueField.value.value)) {
      throw new GraphQLError('value must be a valid numeric string (e.g., "123" or "123.45")', {
        nodes: ast,
      })
    }

    const value = {
      unit: unitField.value.value,
      value: valueField.value.value,
    }

    return amountCurrencyValidation(value)
  },
}

export const scalar = new GraphQLScalarType(config)
