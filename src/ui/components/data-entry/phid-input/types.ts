import type {
  IdAutocompleteOption,
  IdAutocompleteProps,
} from '../../../../scalars/components/fragments/id-autocomplete/types.js'
import type { WithDifference } from '../../../../scalars/components/types.js'

interface PHIDInputWithDifference extends Omit<WithDifference<string>, 'diffMode'> {
  basePreviewIcon?: IdAutocompleteOption['icon']
  basePreviewTitle?: IdAutocompleteOption['title']
  basePreviewPath?: IdAutocompleteOption['path']
  basePreviewDescription?: IdAutocompleteOption['description']
}

type PHIDOption = IdAutocompleteOption

type PHIDInputBaseProps = Omit<
  IdAutocompleteProps,
  | 'autoComplete'
  | 'fetchOptionsCallback'
  | 'fetchSelectedOptionCallback'
  | 'previewPlaceholder'
  | 'renderOption'
  | 'renderExtraDiffs'
> &
  (
    | {
        allowUris: true
        allowedScopes?: string[]
      }
    | {
        allowUris?: false
        allowedScopes?: never
      }
  )

type PHIDInputProps = PHIDInputBaseProps &
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
        ) => Promise<PHIDOption[]> | PHIDOption[]
        fetchSelectedOptionCallback?: (value: string) => Promise<PHIDOption | undefined> | PHIDOption | undefined
        previewPlaceholder?: PHIDOption
      }
  ) &
  PHIDInputWithDifference

export type { PHIDInputProps, PHIDOption }
