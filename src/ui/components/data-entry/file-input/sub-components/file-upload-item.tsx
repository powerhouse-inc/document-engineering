import { cn } from '../../../../../scalars/lib/utils.js'
import { ProgressBar } from '../../../../../scalars/components/fragments/progress-bar/progress-bar.js'
import type { IconName } from '../../../icon-components/index.js'
import { Icon } from '../../../icon/icon.js'
import { FormMessageList } from '../../../../../scalars/components/fragments/form-message/message-list.js'
import type { UploadFile } from '../types.js'
import { MESSAGES } from '../utils.js'

interface FileUploadItemProps {
  fileName?: string
  fileSize?: string
  progress?: number
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onReload?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  icon?: IconName
  errorsUpload?: string[]
  status?: UploadFile
}

export const FileUploadItem = ({
  fileName = '',
  fileSize = '',
  progress = undefined,
  onCancel,
  onReload,
  className,
  icon = 'DownloadFile',
  errorsUpload,
  status = 'idle',
}: FileUploadItemProps) => {
  const showProgress = status === 'uploading' && progress !== undefined && progress >= 0 && progress < 100
  const showSuccess = status === 'success'
  const showError = status === 'error'

  const showErrorsUpload = Array.isArray(errorsUpload) && errorsUpload.length > 0

  const handleOnCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onCancel?.(e)
  }

  const handleOnReload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onReload?.(e)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-md shadow-[0px_2px_12px_0px_rgba(37,42,52,0.10)] w-full',
        'pt-2 px-2 pb-1',
        'border-gray-100',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex flex-1 gap-2 ">
          <Icon name={icon} size={36} />

          <div className="flex w-23 flex-col">
            <span className={cn('text-gray-900 text-xs font-medium leading-4.5', 'truncate')}>{fileName}</span>
            <span className="text-gray-500 text-xs leading-4.5 font-medium">{fileSize}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {showProgress && <span className="text-gray-600 font-medium text-xs">{Math.round(progress)}%</span>}
            {status === 'error' && (
              <button
                type="button"
                onClick={handleOnReload}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Reload upload"
              >
                <Icon name="Reload" size={16} className="text-gray-900" />
              </button>
            )}

            <button
              type="button"
              onClick={handleOnCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cancel Upload"
            >
              <Icon name="XmarkLight" size={16} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-0.5 h-4.5">
        {showProgress && (
          <ProgressBar
            value={progress}
            className="h-2 bg-gray-100 [&_[data-slot=progress-bar-indicator]]:bg-blue-600"
          />
        )}
        {showSuccess && <span className="text-green-700 text-xs leading-4.5 font-normal">{MESSAGES.success}</span>}
        {showError && <span className="text-red-900 text-xs leading-4.5 font-normal">{MESSAGES.error}</span>}
      </div>

      {showErrorsUpload && <FormMessageList messages={errorsUpload} type="error" className="gap-0.5" />}
    </div>
  )
}
