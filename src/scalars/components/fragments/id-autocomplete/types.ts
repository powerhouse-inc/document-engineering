import type { IconName } from '../../../../ui/components/icon/index.js'
import type React from 'react'
import type { InputBaseProps, ViewMode } from '../../types.js'

interface IdAutocompleteBaseConfigProps {
  onChange?: (value: string) => void
  placeholder?: string
  maxLength?: number
}

type IdAutocompleteConfigProps = IdAutocompleteBaseConfigProps &
  (
    | {
        autoComplete: false
        variant?: never
        isOpenByDefault?: never
        initialOptions?: never
        fetchOptionsCallback?: never
        fetchSelectedOptionCallback?: never
        renderOption?: never
        previewPlaceholder?: never
      }
    | {
        autoComplete?: true
        variant?: 'withValue' | 'withValueAndTitle' | 'withValueTitleAndDescription'
        isOpenByDefault?: boolean
        initialOptions?: IdAutocompleteOption[]
        fetchOptionsCallback: (
          userInput: string,
          context?: Record<string, unknown>
        ) => Promise<IdAutocompleteOption[]> | IdAutocompleteOption[]
        fetchSelectedOptionCallback?: (
          value: string
        ) => Promise<IdAutocompleteOption | undefined> | IdAutocompleteOption | undefined
        renderOption?: (
          option: IdAutocompleteOption,
          displayProps?: {
            asPlaceholder?: boolean
            showValue?: boolean
            isLoadingSelectedOption?: boolean
            handleFetchSelectedOption?: (value: string) => void
            isFetchSelectedOptionSync?: boolean
            className?: string
          }
        ) => React.ReactNode
        previewPlaceholder?: IdAutocompleteOption
      }
  )

interface IdAutocompleteOption {
  icon?: IconName | React.ReactElement
  title?: string
  path?:
    | string
    | {
        text: string
        url: string
      }
  value: string
  description?: string
}

type IdAutocompleteProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof InputBaseProps<string> | keyof IdAutocompleteConfigProps | 'pattern'
> &
  InputBaseProps<string> &
  IdAutocompleteConfigProps & {
    viewMode?: ViewMode
    baseValue?: IdAutocompleteOption['value']
    basePreviewIcon?: IdAutocompleteOption['icon']
    basePreviewTitle?: IdAutocompleteOption['title']
    basePreviewPath?: IdAutocompleteOption['path']
    basePreviewDescription?: IdAutocompleteOption['description']
    renderExtraDiffs?: (
      viewMode: ViewMode,
      previewPlaceholder?: IdAutocompleteOption,
      currentOption?: IdAutocompleteOption
    ) => React.ReactNode
  }

export type { IdAutocompleteOption, IdAutocompleteProps }
