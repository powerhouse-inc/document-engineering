import { cn } from '../../../../../scalars/lib/utils.js'
import PreviewHeader from './preview-header.js'

interface FilePreviewStateProps {
  onClose?: () => void
  preview?: string
  className?: string
}

const PreviewFile = ({ onClose = () => null, preview, className }: FilePreviewStateProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4',
        className
      )}
    >
      <PreviewHeader status="idle" onClose={onClose} title="PDF Preview" />

      <div className="flex-1 relative rounded-md overflow-hidden h-full w-full">
        <iframe
          src={`${preview}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Previsualización de PDF"
          className="w-full h-full border-none"
          height={652}
          width={500}
        >
          <p>Your browser does not support the preview.</p>
        </iframe>
      </div>
    </div>
  )
}

export default PreviewFile
