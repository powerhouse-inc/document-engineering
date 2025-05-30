import type { Props } from './types.js'

const PowerhouseLogoSmall = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="currentcolor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0059 0L3.41636 5.45646C2.44979 6.25682 2.3795 7.71452 3.26456 8.60418L5.54425 10.8957C6.21311 11.568 6.35783 12.6012 5.89944 13.4314L4.48126 16H2.13333C0.955126 16 0 15.0449 0 13.8667V2.13333C0 0.955126 0.955126 0 2.13333 0H10.0059ZM11.2436 0L10.0128 2.24221C9.55899 3.06891 9.70183 4.09549 10.3641 4.7669L12.7825 7.21868C13.6656 8.11402 13.5866 9.57512 12.612 10.37L5.70922 16H13.8667C15.0449 16 16 15.0449 16 13.8667V2.13333C16 0.955126 15.0449 0 13.8667 0H11.2436Z"
      />
    </svg>
  )
}

PowerhouseLogoSmall.displayName = 'PowerhouseLogoSmall'

export default PowerhouseLogoSmall
