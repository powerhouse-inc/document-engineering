import type {
  IdAutocompleteOption,
  IdAutocompleteProps,
} from '../../../../scalars/components/fragments/id-autocomplete/types.js'

interface Network {
  chainId: string
  name?: string
}

interface AIDOptionProps {
  agentType?: string
}

// TODO: fix this type
// @ts-expect-error - this will be fixed soon
type AIDOption = IdAutocompleteOption<AIDOptionProps>

type AIDInputBaseProps = Omit<
  IdAutocompleteProps,
  'autoComplete' | 'fetchOptionsCallback' | 'fetchSelectedOptionCallback' | 'previewPlaceholder' | 'renderOption'
> & {
  supportedNetworks?: Network[]
}

type AIDInputProps = AIDInputBaseProps &
  (
    | {
        autoComplete: false
        fetchOptionsCallback?: never
        fetchSelectedOptionCallback?: never
        previewPlaceholder?: never
      }
    | {
        autoComplete?: true
        fetchOptionsCallback: (
          userInput: string,
          context?: Record<string, unknown>
        ) => Promise<AIDOption[]> | AIDOption[]
        fetchSelectedOptionCallback?: (value: string) => Promise<AIDOption | undefined> | AIDOption | undefined
        previewPlaceholder?: AIDOption
      }
  )

export type { AIDInputProps, AIDOption }
