import { GraphQLUpload } from 'graphql-upload'
import type { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'

export interface ScalarType {
  input: 'Upload'
  output: 'File'
}

export const type = 'FileUpload'

export const typedef = 'scalar Upload'

export const config: GraphQLScalarTypeConfig<string, string> = {
  name: 'Upload',
  description: 'A custom scalar that represents a file upload',
}

// This export is required to satisfy the `validationSchema` generator
export const stringSchema = 'z.any()'

export const scalar: GraphQLScalarType = GraphQLUpload
