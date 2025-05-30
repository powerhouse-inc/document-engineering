import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'
import { z } from 'zod'

export interface ScalarType {
  input: string
  output: string
}

export const type = 'string'

export const typedef = 'scalar Currency'

export const schema = z.string()

export const stringSchema = 'z.string()'

const currencyValidation = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string: ${JSON.stringify(value)}`)
  }

  const result = schema.safeParse(value)

  if (result.success) return result.data
  throw new GraphQLError(result.error.message)
}

export const config: GraphQLScalarTypeConfig<string, string> = {
  name: 'Currency',
  description: 'A custom scalar that represents a Currency Code string',
  serialize: currencyValidation,
  parseValue: currencyValidation,
  parseLiteral: (value) => {
    if (value.kind !== Kind.STRING) {
      throw new GraphQLError(`Value is not a valid string: ${value.kind}`, {
        nodes: value,
      })
    }

    return currencyValidation(value.value)
  },
}

export const scalar = new GraphQLScalarType(config)
