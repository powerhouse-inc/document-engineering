import type { Props } from './types.js'

const ChevronDown = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentcolor">
      <path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

ChevronDown.displayName = 'ChevronDown'

export default ChevronDown
