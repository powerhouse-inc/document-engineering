import { cn } from '../../../../../scalars/lib/utils.js'
import PreviewHeader from './preview-header.js'

interface FilePreviewStateProps {
  onClose: () => void
  className?: string
  preview?: string
}

const PreviewImage = ({ onClose, className, preview }: FilePreviewStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,115,0.25)] px-6 py-4 gap-4 w-[368px] h-[384px]',
        className
      )}
    >
      <PreviewHeader status="idle" onClose={onClose} title="Image Preview" />
      <div className="flex justify-center items-center relative rounded-md overflow-hidden">
        {preview && <img src={preview} alt="Preview" className="w-full h-full object-contain" />}
      </div>
    </div>
  )
}

export default PreviewImage
