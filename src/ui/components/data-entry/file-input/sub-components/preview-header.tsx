import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'

type HeaderStatus = 'idle' | 'error'

interface PreviewHeaderProps {
  status: HeaderStatus
  onClose: () => void
  title?: string
}

const PreviewHeader = ({ status, onClose, title = 'File Preview' }: PreviewHeaderProps) => {
  return (
    <header className="flex justify-between items-center">
      <span className={cn('text-gray-900 text-sm font-normal leading-4.5', status === 'error' && 'text-red-900')}>
        {title}
      </span>
      <button type="button" onClick={onClose} aria-label="Close preview" className="text-gray-400 hover:text-gray-600">
        <Icon name="XmarkLight" size={16} className="text-gray-900" />
      </button>
    </header>
  )
}

export default PreviewHeader
