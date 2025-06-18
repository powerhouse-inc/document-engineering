import type {
  IdAutocompleteOption,
  IdAutocompleteProps,
} from '../../../../scalars/components/fragments/id-autocomplete/types.js'

interface Network {
  chainId: string
  name?: string
}

type AIDOption = IdAutocompleteOption & {
  agentType?: string
}

type AIDInputBaseProps = Omit<
  IdAutocompleteProps,
  | 'autoComplete'
  | 'fetchOptionsCallback'
  | 'fetchSelectedOptionCallback'
  | 'previewPlaceholder'
  | 'renderOption'
  | 'renderExtraDiffs'
> & {
  supportedNetworks?: Network[]
  basePreviewAgentType?: string
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
