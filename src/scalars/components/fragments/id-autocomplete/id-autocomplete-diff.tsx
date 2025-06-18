import React from 'react'
import { Icon, type IconName } from '../../../../ui/components/icon/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/index.js'
import { cn } from '../../../../scalars/lib/index.js'
import { SplittedInputDiff } from '../../../../ui/components/data-entry/input/splitted-input-diff.js'
import { TextDiff } from '../../../../ui/components/data-entry/input/subcomponent/text-diff.js'
import type { IdAutocompleteOption, IdAutocompleteProps } from './types.js'

interface IconRendererProps {
  customIcon?: IconName | React.ReactElement
  asPlaceholder?: boolean
  isRemoval?: boolean
  isAddition?: boolean
}

const IconRenderer = ({ customIcon, asPlaceholder }: IconRendererProps) => {
  if (typeof customIcon === 'string') {
    return (
      <Icon name={customIcon} size={24} className={cn('shrink-0', asPlaceholder ? 'text-gray-400' : 'text-gray-700')} />
    )
  }
  if (React.isValidElement(customIcon)) {
    return <div className={cn('size-6 shrink-0 overflow-hidden')}>{customIcon}</div>
  }
  return null
}

interface IdAutocompleteDiffProps {
  value: IdAutocompleteProps['value']
  currentOption?: IdAutocompleteOption
  label: IdAutocompleteProps['label']
  required: IdAutocompleteProps['required']
  autoComplete: IdAutocompleteProps['autoComplete']
  previewPlaceholder: IdAutocompleteProps['previewPlaceholder']
  variant: IdAutocompleteProps['variant']
  viewMode: IdAutocompleteProps['viewMode']
  baseValue: IdAutocompleteProps['baseValue']
  basePreviewIcon: IdAutocompleteProps['basePreviewIcon']
  basePreviewTitle: IdAutocompleteProps['basePreviewTitle']
  basePreviewPath: IdAutocompleteProps['basePreviewPath']
  basePreviewDescription: IdAutocompleteProps['basePreviewDescription']
  renderExtraDiffs: IdAutocompleteProps['renderExtraDiffs']
}

const IdAutocompleteDiff = ({
  value = '',
  currentOption,
  label,
  required,
  autoComplete,
  previewPlaceholder,
  variant,
  viewMode = 'addition',
  baseValue = '',
  basePreviewIcon,
  basePreviewTitle = '',
  basePreviewPath = '',
  basePreviewDescription = '',
  renderExtraDiffs,
}: IdAutocompleteDiffProps) => {
  const previewPlaceholderPath =
    (typeof previewPlaceholder?.path === 'object' ? previewPlaceholder.path.text : previewPlaceholder?.path) ?? ''
  const basePreviewPathText = typeof basePreviewPath === 'object' ? basePreviewPath.text : basePreviewPath
  const basePreviewPathUrl = typeof basePreviewPath === 'object' ? basePreviewPath.url : undefined

  const previewTitle = currentOption?.title ?? ''
  const previewPathText =
    (typeof currentOption?.path === 'object' ? currentOption.path.text : currentOption?.path) ?? ''
  const previewPathUrl = typeof currentOption?.path === 'object' ? currentOption.path.url : undefined
  const previewDescription = currentOption?.description ?? ''

  const placeholderIcon = previewPlaceholder?.icon ?? 'PowerhouseLogoSmall'
  const baseIcon = basePreviewIcon ?? placeholderIcon
  const baseIconAsPlaceholder = !basePreviewIcon
  const currentIcon = currentOption?.icon ?? placeholderIcon
  const currentIconAsPlaceholder = !currentOption?.icon

  return (
    <div className={cn('flex flex-col gap-2')}>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}

      {/* container for the entire fake PHID component */}
      <div className={cn('relative w-full rounded-md bg-gray-100')}>
        {/* input absolutely positioned */}
        <div className={cn('absolute left-0 right-0 top-0 z-10 w-full rounded-md bg-gray-50')}>
          <SplittedInputDiff
            baseValue={baseValue}
            value={value}
            viewMode={viewMode}
            diffMode="sentences"
            showCopyIcon={true}
          />
        </div>

        {/* container for the option preview */}
        {autoComplete && (variant === 'withValueAndTitle' || variant === 'withValueTitleAndDescription') && (
          <div className={cn('w-full max-w-full rounded-md px-3 pb-2 pt-3')}>
            <div className={cn('mt-8 flex w-full flex-col gap-1')}>
              <div className={cn('grid w-full', viewMode === 'mixed' && 'grid-cols-2 gap-4')}>
                <div className={cn('flex gap-2 overflow-hidden', viewMode === 'mixed' && 'pr-1')}>
                  {/* left preview icon */}
                  <IconRenderer
                    customIcon={viewMode === 'addition' ? currentIcon : baseIcon}
                    asPlaceholder={viewMode === 'addition' ? currentIconAsPlaceholder : baseIconAsPlaceholder}
                  />

                  <div className={cn('flex min-w-0 grow flex-col gap-1 overflow-hidden')}>
                    {/* left preview title */}
                    {((viewMode === 'removal' || viewMode === 'mixed') && basePreviewTitle === '') ||
                    (viewMode === 'addition' && previewTitle === '') ? (
                      <span className={cn('w-full truncate text-sm font-bold leading-[18px] text-gray-400')}>
                        {previewPlaceholder?.title ?? 'Title not available'}
                      </span>
                    ) : (
                      <TextDiff
                        baseValue={basePreviewTitle}
                        value={previewTitle}
                        viewMode={viewMode === 'mixed' ? 'removal' : viewMode}
                        diffMode="sentences"
                        className={cn('w-full truncate text-sm font-bold leading-[18px]')}
                      />
                    )}

                    {/* left preview path */}
                    {((viewMode === 'removal' || viewMode === 'mixed') && basePreviewPathText === '') ||
                    (viewMode === 'addition' && previewPathText === '') ? (
                      <span className={cn('w-full truncate text-xs leading-[18px] text-gray-400')}>
                        {previewPlaceholderPath === '' ? 'Path not available' : previewPlaceholderPath}
                      </span>
                    ) : (viewMode === 'addition' && previewPathUrl) ||
                      ((viewMode === 'removal' || viewMode === 'mixed') && basePreviewPathUrl) ? (
                      <a
                        href={viewMode === 'addition' ? previewPathUrl : basePreviewPathUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'truncate text-xs leading-[18px] text-blue-900 hover:underline focus-visible:outline-none'
                        )}
                      >
                        <TextDiff
                          baseValue={basePreviewPathText}
                          value={previewPathText}
                          viewMode={viewMode === 'mixed' ? 'removal' : viewMode}
                          diffMode="sentences"
                          className={cn('text-blue-900')}
                        />
                      </a>
                    ) : (
                      <TextDiff
                        baseValue={basePreviewPathText}
                        value={previewPathText}
                        viewMode={viewMode === 'mixed' ? 'removal' : viewMode}
                        diffMode="sentences"
                        className={cn('w-full truncate text-xs leading-[18px] text-gray-500')}
                      />
                    )}
                  </div>
                </div>

                {viewMode === 'mixed' && (
                  <div className={cn('flex gap-2 overflow-hidden pl-1')}>
                    {/* right preview icon */}
                    <IconRenderer customIcon={currentIcon} asPlaceholder={currentIconAsPlaceholder} />

                    <div className={cn('flex min-w-0 grow flex-col gap-1 overflow-hidden')}>
                      {/* right preview title */}
                      {previewTitle === '' ? (
                        <span className={cn('w-full truncate text-sm font-bold leading-[18px] text-gray-400')}>
                          {previewPlaceholder?.title ?? 'Title not available'}
                        </span>
                      ) : (
                        <TextDiff
                          baseValue={basePreviewTitle}
                          value={previewTitle}
                          viewMode="addition"
                          diffMode="sentences"
                          className={cn('w-full truncate text-sm font-bold leading-[18px]')}
                        />
                      )}

                      {/* right preview path */}
                      {previewPathText === '' ? (
                        <span className={cn('w-full truncate text-xs leading-[18px] text-gray-400')}>
                          {previewPlaceholderPath === '' ? 'Path not available' : previewPlaceholderPath}
                        </span>
                      ) : previewPathUrl ? (
                        <a
                          href={previewPathUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'truncate text-xs leading-[18px] text-blue-900 hover:underline focus-visible:outline-none'
                          )}
                        >
                          <TextDiff
                            baseValue={basePreviewPathText}
                            value={previewPathText}
                            viewMode="addition"
                            diffMode="sentences"
                            className={cn('text-blue-900')}
                          />
                        </a>
                      ) : (
                        <TextDiff
                          baseValue={basePreviewPathText}
                          value={previewPathText}
                          viewMode="addition"
                          diffMode="sentences"
                          className={cn('w-full truncate text-xs leading-[18px] text-gray-500')}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {variant === 'withValueTitleAndDescription' && (
                <div className={cn('grid w-full', viewMode === 'mixed' && 'grid-cols-2 gap-4')}>
                  <div className={cn('flex w-full flex-col', viewMode === 'mixed' && 'pr-1')}>
                    {/* left preview description */}
                    {((viewMode === 'removal' || viewMode === 'mixed') && basePreviewDescription === '') ||
                    (viewMode === 'addition' && previewDescription === '') ? (
                      <span className={cn('line-clamp-2 w-full text-xs leading-5 text-gray-400')}>
                        {previewPlaceholder?.description ?? 'Description not available'}
                      </span>
                    ) : (
                      <TextDiff
                        baseValue={basePreviewDescription}
                        value={previewDescription}
                        viewMode={viewMode === 'mixed' ? 'removal' : viewMode}
                        diffMode="sentences"
                        className={cn('w-full text-xs leading-5')}
                        childrenClassName={cn('line-clamp-2')}
                      />
                    )}
                  </div>

                  {viewMode === 'mixed' && (
                    <div className={cn('flex w-full flex-col pl-1')}>
                      {/* right preview description */}
                      {previewDescription === '' ? (
                        <span className={cn('line-clamp-2 w-full text-xs leading-5 text-gray-400')}>
                          {previewPlaceholder?.description ?? 'Description not available'}
                        </span>
                      ) : (
                        <TextDiff
                          baseValue={basePreviewDescription}
                          value={previewDescription}
                          viewMode="addition"
                          diffMode="sentences"
                          className={cn('w-full text-xs leading-5')}
                          childrenClassName={cn('line-clamp-2')}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {variant === 'withValueTitleAndDescription' &&
                renderExtraDiffs?.(viewMode, previewPlaceholder, currentOption)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { IdAutocompleteDiff }
