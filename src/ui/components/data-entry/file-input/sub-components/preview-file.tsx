import { cn } from '../../../../../scalars/lib/utils.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { PlaceHolderPdf } from './placeholder-pdf.js'
import PreviewHeader from './preview-header.js'

interface FilePreviewStateProps {
  onClose?: () => void
  preview?: string
  className?: string
  status: PreviewStatus
}

const PreviewFilePreview = ({ status, onClose = () => null, preview, className }: FilePreviewStateProps) => {
  if (status === PREVIEW_STATUS.SUCCESS && preview) {
    return (
      <div
        className={cn(
          'relative flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full h-full',
          className
        )}
      >
        <PreviewHeader status={status} onClose={onClose} title="PDF Preview" />

        <div className="flex-1 relative rounded-md overflow-hidden">
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

  return <PlaceHolderPdf status={status} onClose={onClose} className={cn('w-full h-full', className)} />
}

export default PreviewFilePreview
