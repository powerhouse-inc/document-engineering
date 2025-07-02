import { GraphQLError, GraphQLScalarType, type GraphQLScalarTypeConfig, Kind } from 'graphql'
import { z } from 'zod'

export interface ScalarType {
  input: string | null
  output: string | null
}

export const type = 'string | null' // TS type in string form

export const typedef = 'scalar EmailAddress'

export const schema = z.string().email().nullable()

export const stringSchema = 'z.string().email().nullable()'

const emailValidation = (value: unknown): string | null => {
  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new GraphQLError(`Value is not string or null: ${JSON.stringify(value)}`)
  }

  const result = schema.safeParse(value)

  if (result.success) return result.data
  throw new GraphQLError(result.error.message)
}

export const config: GraphQLScalarTypeConfig<string | null, string | null> = {
  name: 'EmailAddress',
  description:
    'A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.',
  serialize: emailValidation,
  parseValue: emailValidation,
  parseLiteral: (value) => {
    if (value.kind === Kind.NULL) {
      return null
    }

    if (value.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings or null as email addresses but got a: ${value.kind}`, {
        nodes: value,
      })
    }

    return emailValidation(value.value)
  },
}

export const scalar = new GraphQLScalarType(config)
