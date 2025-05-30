import type { Props } from './types.js'

const TriangleDown = (props: Props) => {
  return (
    <svg {...props} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Triangle Down">
        <path id="Shape" d="M4.7998 7.20001H13.1998L8.9998 12.6L4.7998 7.20001Z" fill="currentColor" />
      </g>
    </svg>
  )
}

TriangleDown.displayName = 'TriangleDown'

export default TriangleDown
