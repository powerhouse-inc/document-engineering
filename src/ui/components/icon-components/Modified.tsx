import type { Props } from './types.js'

const Modified = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentcolor" />
      <circle cx="8" cy="8" r="3" fill="currentcolor" />
    </svg>
  )
}

Modified.displayName = 'Modified'

export default Modified
