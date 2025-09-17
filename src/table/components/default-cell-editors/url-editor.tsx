import { useCallback, useState } from 'react'
import { Popover, PopoverAnchor, PopoverContent } from '../../../scalars/components/fragments/popover/index.js'
import { Tooltip, TooltipProvider } from '../../../ui/components/tooltip/index.js'
import { Icon } from '../../../ui/components/icon/index.js'
import { cn } from '../../../scalars/lib/utils.js'
import { UrlField, type UrlFieldProps } from '../../../scalars/components/url-field/index.js'
import { normalizeStringValue } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'

export const buildUrlCellEditor = <T extends DataType>(
  urlFieldProps: Omit<UrlFieldProps, 'name' | 'value' | 'onChange'>
) => {
  const UrlCellEditor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<T>) => {
    const [hasCopied, setHasCopied] = useState(false)

    const urlValue = normalizeStringValue(value)
    const shouldShowPopover = urlValue !== '' && context.isEditMode

    const handleCopy = useCallback(() => {
      navigator.clipboard
        .writeText(urlValue)
        .then(() => {
          setHasCopied(true)
          setTimeout(() => {
            setHasCopied(false)
          }, 2000)
        })
        .catch((error) => {
          console.error('Failed to copy URL', error)
        })
    }, [urlValue])

    return (
      <Popover open={shouldShowPopover}>
        <PopoverAnchor asChild>
          <div>
            <UrlField
              name={context.column.field}
              className="max-w-full"
              autoFocus
              {...urlFieldProps}
              value={urlValue}
              onChange={(e) => {
                onChange(e.target.value)
              }}
            />
          </div>
        </PopoverAnchor>
        {shouldShowPopover && (
          <PopoverContent
            align="start"
            sideOffset={12}
            className={cn('flex items-center gap-2 px-3 py-2 border-none w-fit')}
            onOpenAutoFocus={(e) => {
              e.preventDefault()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
            }}
          >
            <div className="max-w-60">
              <a
                href={urlValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline focus-visible:outline-none truncate block text-sm"
                title={urlValue}
              >
                {urlValue}
              </a>
            </div>
            <TooltipProvider>
              <Tooltip content="Copied!" open={hasCopied} triggerAsChild>
                <button
                  type="button"
                  aria-label="Copy URL"
                  onClick={handleCopy}
                  className={cn('focus-visible:outline-none [&_svg]:pointer-events-none')}
                >
                  <Icon name="Copy" size={16} className={cn('text-gray-500 dark:text-gray-600')} />
                </button>
              </Tooltip>
            </TooltipProvider>
          </PopoverContent>
        )}
      </Popover>
    )
  }

  return UrlCellEditor
}
