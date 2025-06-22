import React, { useCallback, useId, useMemo } from 'react'
import { IdAutocompleteContext } from '../../../../scalars/components/fragments/id-autocomplete/id-autocomplete-context.js'
import { IdAutocompleteListOption } from '../../../../scalars/components/fragments/id-autocomplete/id-autocomplete-list-option.js'
import { IdAutocomplete } from '../../../../scalars/components/fragments/id-autocomplete/index.js'
import { TextDiff } from '../input/subcomponent/text-diff.js'
import { cn } from '../../../../scalars/lib/index.js'
import type { AIDInputProps, AIDOption } from './types.js'
import type { ViewMode } from '../../../../scalars/components/types.js'

const AIDInput = React.forwardRef<HTMLInputElement, AIDInputProps>(
  (
    {
      id: idProp,
      name,
      className,
      label,
      description,
      value,
      defaultValue,
      disabled,
      placeholder,
      required,
      errors,
      warnings,
      onChange,
      onBlur,
      onClick,
      onMouseDown,
      supportedNetworks,
      autoComplete: autoCompleteProp,
      variant = 'withValue',
      maxLength,
      fetchOptionsCallback,
      fetchSelectedOptionCallback,
      isOpenByDefault, // to be used only in stories
      initialOptions,
      previewPlaceholder,
      basePreviewAgentType,
      ...props
    },
    ref
  ) => {
    const prefix = useId()
    const id = idProp ?? `${prefix}-aid`
    const autoComplete = autoCompleteProp ?? true

    const contextValue = useMemo(() => ({ supportedNetworks }), [supportedNetworks])

    const renderOption = useCallback(
      (
        option: AIDOption,
        displayProps?: {
          asPlaceholder?: boolean
          showValue?: boolean
          isLoadingSelectedOption?: boolean
          handleFetchSelectedOption?: (value: string) => void
          isFetchSelectedOptionSync?: boolean
          className?: string
        }
      ) => (
        <IdAutocompleteListOption
          variant={variant}
          icon={option.icon}
          title={option.title}
          path={
            displayProps?.asPlaceholder
              ? (previewPlaceholder?.path ?? 'URL not available')
              : (option.path ?? 'URL not available')
          }
          value={displayProps?.asPlaceholder ? (previewPlaceholder?.value ?? 'aid not available') : option.value}
          description={option.description}
          agentType={
            displayProps?.asPlaceholder
              ? (previewPlaceholder?.agentType ?? 'Agent type not available')
              : (option.agentType ?? 'Agent type not available')
          }
          placeholderIcon={previewPlaceholder?.icon ?? 'Person'}
          {...displayProps}
        />
      ),
      [variant, previewPlaceholder]
    )

    const renderAgentTypeDiffs = useCallback(
      (viewMode: ViewMode, previewPlaceholder?: AIDOption, currentOption?: AIDOption) => {
        const previewPlaceholderAgentType = previewPlaceholder?.agentType ?? 'Agent type not available'
        const previewAgentType = currentOption?.agentType

        return basePreviewAgentType !== undefined || previewAgentType !== undefined ? (
          <div className={cn('grid w-full', viewMode === 'mixed' && 'grid-cols-2 gap-4')}>
            <div className={cn('flex w-full flex-col overflow-hidden', viewMode === 'mixed' && 'pr-1')}>
              {((viewMode === 'removal' || viewMode === 'mixed') &&
                (basePreviewAgentType === '' || basePreviewAgentType === undefined)) ||
              (viewMode === 'addition' && (previewAgentType === '' || previewAgentType === undefined)) ? (
                <span className={cn('w-full text-right truncate text-xs leading-5 text-gray-400')}>
                  {previewPlaceholderAgentType}
                </span>
              ) : (
                <TextDiff
                  baseValue={basePreviewAgentType}
                  value={previewAgentType ?? ''}
                  viewMode={viewMode === 'mixed' ? 'removal' : viewMode}
                  diffMode="sentences"
                  className={cn('w-full text-right truncate text-xs leading-5 text-gray-500')}
                />
              )}
            </div>

            {viewMode === 'mixed' && (
              <div className={cn('flex w-full flex-col overflow-hidden pl-1')}>
                {previewAgentType === '' || previewAgentType === undefined ? (
                  <span className={cn('w-full text-right truncate text-xs leading-5 text-gray-400')}>
                    {previewPlaceholderAgentType}
                  </span>
                ) : (
                  <TextDiff
                    baseValue={basePreviewAgentType}
                    value={previewAgentType}
                    viewMode="addition"
                    diffMode="sentences"
                    className={cn('w-full text-right truncate text-xs leading-5 text-gray-500')}
                  />
                )}
              </div>
            )}
          </div>
        ) : null
      },
      [basePreviewAgentType]
    )

    return (
      <IdAutocompleteContext.Provider value={contextValue}>
        {autoComplete && fetchOptionsCallback ? (
          <IdAutocomplete
            id={id}
            name={name}
            className={className}
            label={label}
            description={description}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            errors={errors}
            warnings={warnings}
            onChange={onChange}
            onBlur={onBlur}
            onClick={onClick}
            onMouseDown={onMouseDown}
            autoComplete={true}
            variant={variant}
            maxLength={maxLength}
            fetchOptionsCallback={fetchOptionsCallback}
            fetchSelectedOptionCallback={fetchSelectedOptionCallback}
            isOpenByDefault={isOpenByDefault}
            initialOptions={initialOptions}
            renderOption={renderOption}
            previewPlaceholder={previewPlaceholder}
            renderExtraDiffs={renderAgentTypeDiffs}
            {...props}
            ref={ref}
          />
        ) : (
          <IdAutocomplete
            id={id}
            name={name}
            className={className}
            label={label}
            description={description}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            errors={errors}
            warnings={warnings}
            onChange={onChange}
            onBlur={onBlur}
            onClick={onClick}
            onMouseDown={onMouseDown}
            autoComplete={false}
            maxLength={maxLength}
            {...props}
            ref={ref}
          />
        )}
      </IdAutocompleteContext.Provider>
    )
  }
)

AIDInput.displayName = 'AIDInput'

export { AIDInput }
