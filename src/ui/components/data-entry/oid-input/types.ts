import type {
  IdAutocompleteOption,
  IdAutocompleteProps,
} from '../../../../scalars/components/fragments/id-autocomplete/types.js'
import type { WithDifference } from '../../../../scalars/components/types.js'

interface OIDInputWithDifference extends Omit<WithDifference<string>, 'diffMode'> {
  basePreviewIcon?: IdAutocompleteOption['icon']
  basePreviewTitle?: IdAutocompleteOption['title']
  basePreviewPath?: IdAutocompleteOption['path']
  basePreviewDescription?: IdAutocompleteOption['description']
}

type OIDOption = IdAutocompleteOption

type OIDInputBaseProps = Omit<
  IdAutocompleteProps,
  | 'autoComplete'
  | 'fetchOptionsCallback'
  | 'fetchSelectedOptionCallback'
  | 'previewPlaceholder'
  | 'renderOption'
  | 'renderExtraDiffs'
>

type OIDInputProps = OIDInputBaseProps &
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
        ) => Promise<OIDOption[]> | OIDOption[]
        fetchSelectedOptionCallback?: (value: string) => Promise<OIDOption | undefined> | OIDOption | undefined
        previewPlaceholder?: OIDOption
      }
  ) &
  OIDInputWithDifference

export type { OIDInputProps, OIDOption }
