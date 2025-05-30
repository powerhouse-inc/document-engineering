import DownloadFile from '../icon-components/DownloadFile.js'
import ExportPdf from '../icon-components/ExportPdf.js'
import ExportUbl from '../icon-components/ExportUbl.js'
import ExportZip from '../icon-components/ExportZip.js'
import { Dropdown, DropdownContent, DropdownItem } from './index.js'
import { DropdownTrigger } from './subcomponents/dropdown-trigger.js'

const DropdownExample = () => {
  return (
    <Dropdown>
      <DropdownTrigger className="w-[184px]">
        <DownloadFile width={16} height={16} />
        Export as
      </DropdownTrigger>
      <DropdownContent className="w-[184px]">
        <DropdownItem
          onClick={() => {
            // eslint-disable-next-line no-alert
            alert('Powerhouse Invoice')
          }}
        >
          <ExportZip width={16} height={16} />
          <span>Powerhouse Invoice</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            // eslint-disable-next-line no-alert
            alert('UBL file')
          }}
        >
          <ExportUbl width={16} height={16} />
          <span>UBL file</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            // eslint-disable-next-line no-alert
            alert('PDF file')
          }}
        >
          <ExportPdf width={16} height={16} />
          <span>PDF file</span>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}

export default DropdownExample
