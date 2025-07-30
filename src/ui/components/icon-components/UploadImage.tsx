import type { Props } from './types.js'

const UploadImage = (props: Props) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#9EA0A1" />
      <path
        d="M36.6671 19.9998C36.6671 24.5423 37.6894 31.4231 35 34.1665C31.9751 37.2521 24.6628 36.6665 20.0005 36.6665C15.4581 36.6665 8.83959 37.1136 5.83334 34.1665C2.74774 31.1416 3.33382 24.6622 3.33382 19.9998L8.33382 11.6665L20.0005 27.4998L32.5005 16.6665L36.6671 19.9998Z"
        fill="#F4F4F4"
      />
      <circle cx="25" cy="11.6668" r="3.33333" fill="#F4F4F4" />
    </svg>
  )
}

UploadImage.displayName = 'UploadImage'

export default UploadImage
