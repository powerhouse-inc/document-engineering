import { cn } from '../../../../../scalars/lib/utils.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { PlaceHolderImage } from './place-holder-image.js'
import PreviewHeader from './preview-header.js'

interface FilePreviewStateProps {
  status: PreviewStatus
  onClose: () => void
  className?: string
  preview?: string
}

const PreviewImagePreview = ({ status, onClose, className, preview }: FilePreviewStateProps) => {
  if (status === PREVIEW_STATUS.SUCCESS) {
    return (
      <div
        className={cn(
          'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,115,0.25)] px-6 py-4 gap-4 w-full h-full',
          className
        )}
      >
        <PreviewHeader status={status} onClose={onClose} title="Image Preview" />
        <div className="flex justify-center items-center relative rounded-md overflow-hidden">
          {preview && <img src={preview} alt="Preview" className="w-full h-full object-contain" />}
        </div>
      </div>
    )
  }

  return <PlaceHolderImage status={status} onClose={onClose} className={className} />
}

export default PreviewImagePreview
