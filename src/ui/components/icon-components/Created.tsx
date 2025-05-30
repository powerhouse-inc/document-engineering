import type { Props } from './types.js'

const Created = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentcolor" />
      <path d="M4 8H12" stroke="currentcolor" strokeLinecap="round" />
      <path d="M8 12V4" stroke="currentcolor" strokeLinecap="round" />
    </svg>
  )
}

Created.displayName = 'Created'

export default Created
