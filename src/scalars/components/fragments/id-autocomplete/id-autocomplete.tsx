import React, { useId, useMemo, useRef } from 'react'
import { Input } from '../../../../ui/components/data-entry/input/index.js'
import { sharedValueTransformers } from '../../../lib/shared-value-transformers.js'
import { cn } from '../../../lib/utils.js'
import { Command } from '../command/index.js'
import { FormDescription } from '../form-description/index.js'
import { FormGroup } from '../form-group/index.js'
import { FormLabel } from '../form-label/index.js'
import { FormMessageList } from '../form-message/index.js'
import { Popover, PopoverAnchor, PopoverContent } from '../popover/index.js'
import ValueTransformer, { type TransformerType } from '../value-transformer/index.js'
import { IdAutocompleteInputContainer } from './id-autocomplete-input-container.js'
import { IdAutocompleteListOption } from './id-autocomplete-list-option.js'
import { IdAutocompleteList } from './id-autocomplete-list.js'
import { IdAutocompleteDiff } from './id-autocomplete-diff.js'
import type { IdAutocompleteProps } from './types.js'
import { useIdAutocomplete } from './use-id-autocomplete.js'

const IdAutocomplete = React.forwardRef<HTMLInputElement, IdAutocompleteProps>(
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
      onKeyDown,
      onMouseDown,
      autoComplete = true,
      variant = 'withValue',
      maxLength,
      fetchOptionsCallback,
      fetchSelectedOptionCallback,
      isOpenByDefault, // to be used only in stories
      initialOptions,
      renderOption,
      previewPlaceholder,
      viewMode = 'edition',
      baseValue,
      basePreviewIcon,
      basePreviewTitle,
      basePreviewPath,
      basePreviewDescription,
      renderExtraDiffs,
      ...props
    },
    ref
  ) => {
    const prefix = useId()
    const id = idProp ?? `${prefix}-id-autocomplete`
    const inputRef = useRef<HTMLInputElement | null>(null)

    const mergedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    const hasWarning = Array.isArray(warnings) && warnings.length > 0
    const hasError = Array.isArray(errors) && errors.length > 0

    const {
      selectedValue,
      selectedOption,
      isPopoverOpen,
      commandListRef,
      options,
      isLoading,
      isLoadingSelectedOption,
      haveFetchError,
      commandValue,
      isFetchSelectedOptionSync,
      toggleOption,
      handleOpenChange,
      onTriggerBlur,
      handleChange,
      handleCommandValue,
      handleFetchSelectedOption,
      handlePaste,
    } = useIdAutocomplete({
      autoComplete,
      defaultValue,
      value,
      isOpenByDefault,
      initialOptions,
      onChange,
      onBlur,
      fetchOptions: fetchOptionsCallback,
      fetchSelectedOption: fetchSelectedOptionCallback,
    })

    const handleOptionSelection = (optionValue: string) => {
      toggleOption(optionValue)
      inputRef.current?.focus()
    }

    const asCard = variant === 'withValueAndTitle' || variant === 'withValueTitleAndDescription'

    const transformers: TransformerType = useMemo(
      () => [sharedValueTransformers.trimOnBlur(), sharedValueTransformers.trimOnEnter()],
      []
    )

    if (viewMode !== 'edition') {
      return (
        <IdAutocompleteDiff
          value={selectedValue}
          currentOption={selectedOption}
          label={label}
          required={required}
          autoComplete={autoComplete}
          previewPlaceholder={previewPlaceholder}
          variant={variant}
          viewMode={viewMode}
          baseValue={baseValue}
          basePreviewIcon={basePreviewIcon}
          basePreviewTitle={basePreviewTitle}
          basePreviewPath={basePreviewPath}
          basePreviewDescription={basePreviewDescription}
          renderExtraDiffs={renderExtraDiffs}
        />
      )
    }

    return (
      <FormGroup>
        {!!label && (
          <FormLabel
            htmlFor={id}
            disabled={disabled}
            hasError={hasError}
            required={required}
            onClick={(e) => {
              e.preventDefault()
              ;(e.target as HTMLLabelElement).control?.focus()
            }}
          >
            {label}
          </FormLabel>
        )}
        {autoComplete && fetchOptionsCallback ? (
          <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
            <Command
              shouldFilter={false}
              value={commandValue}
              onValueChange={handleCommandValue}
              className={cn('dark:bg-charcoal-900 bg-gray-100')}
            >
              <PopoverAnchor asChild={true}>
                <IdAutocompleteInputContainer
                  id={id}
                  name={name}
                  value={selectedValue}
                  className={className}
                  isLoading={isLoading}
                  haveFetchError={haveFetchError}
                  disabled={disabled}
                  onChange={handleChange}
                  onBlur={onTriggerBlur}
                  onClick={onClick}
                  selectedOption={selectedOption}
                  optionsLength={options.length}
                  handleOpenChange={handleOpenChange}
                  onKeyDown={onKeyDown}
                  onMouseDown={onMouseDown}
                  placeholder={placeholder}
                  hasError={hasError}
                  label={label}
                  required={required}
                  isPopoverOpen={isPopoverOpen}
                  maxLength={maxLength}
                  handlePaste={handlePaste}
                  {...props}
                  ref={mergedRef}
                />
              </PopoverAnchor>
              {asCard &&
                (renderOption ? (
                  renderOption(
                    selectedOption === undefined && previewPlaceholder
                      ? {
                          ...previewPlaceholder,
                        }
                      : {
                          ...selectedOption,
                          value: selectedOption?.value ?? '',
                        },
                    {
                      asPlaceholder: selectedOption === undefined,
                      showValue: false,
                      isLoadingSelectedOption,
                      handleFetchSelectedOption: fetchSelectedOptionCallback ? handleFetchSelectedOption : undefined,
                      isFetchSelectedOptionSync,
                      className: cn('rounded-t-none pt-2'),
                    }
                  )
                ) : (
                  <IdAutocompleteListOption
                    variant={variant}
                    icon={selectedOption?.icon ?? previewPlaceholder?.icon}
                    title={selectedOption?.title ?? previewPlaceholder?.title}
                    path={selectedOption?.path ?? previewPlaceholder?.path}
                    value={selectedOption?.value ?? previewPlaceholder?.value ?? ''}
                    description={selectedOption?.description ?? previewPlaceholder?.description}
                    asPlaceholder={selectedOption === undefined}
                    showValue={false}
                    isLoadingSelectedOption={isLoadingSelectedOption}
                    handleFetchSelectedOption={fetchSelectedOptionCallback ? handleFetchSelectedOption : undefined}
                    isFetchSelectedOptionSync={isFetchSelectedOptionSync}
                    className={cn('rounded-t-none pt-2')}
                  />
                ))}
              <PopoverContent
                align="start"
                onOpenAutoFocus={(e) => {
                  e.preventDefault()
                }}
                onInteractOutside={(e) => {
                  if (e.target instanceof Element && e.target.id === id) {
                    e.preventDefault()
                  }
                }}
              >
                <IdAutocompleteList
                  variant={variant}
                  commandListRef={commandListRef}
                  selectedValue={selectedValue}
                  options={options}
                  toggleOption={handleOptionSelection}
                  renderOption={renderOption}
                  previewPlaceholder={previewPlaceholder}
                />
              </PopoverContent>
            </Command>
          </Popover>
        ) : (
          <ValueTransformer transformers={transformers}>
            <Input
              id={id}
              name={name}
              value={selectedValue}
              className={className}
              disabled={disabled}
              onChange={handleChange}
              onBlur={onBlur}
              onClick={onClick}
              onMouseDown={onMouseDown}
              placeholder={placeholder}
              aria-invalid={hasError}
              aria-label={!label ? 'Id Autocomplete' : undefined}
              aria-required={required}
              maxLength={maxLength}
              {...props}
              ref={mergedRef}
            />
          </ValueTransformer>
        )}
        {!!description && <FormDescription>{description}</FormDescription>}
        {hasWarning && <FormMessageList messages={warnings} type="warning" />}
        {hasError && <FormMessageList messages={errors} type="error" />}
      </FormGroup>
    )
  }
)

IdAutocomplete.displayName = 'IdAutocomplete'

export { IdAutocomplete }
