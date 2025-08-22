import type { Props } from './types.js'

const PlaceholderAudio = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64.0003 101.333V117.333M64.0003 101.333C73.9017 101.333 83.3976 97.4 90.399 90.3986C97.4003 83.3972 101.334 73.9014 101.334 64V53.3333M64.0003 101.333C54.0989 101.333 44.603 97.4 37.6017 90.3986C30.6003 83.3972 26.667 73.9014 26.667 64V53.3333M64.0003 10.6666C72.8369 10.6666 80.0003 17.8301 80.0003 26.6666V64C80.0003 72.8365 72.8369 80 64.0003 80C55.1638 80 48.0003 72.8365 48.0003 64V26.6666C48.0003 17.8301 55.1638 10.6666 64.0003 10.6666Z"
        stroke="currentColor"
        strokeWidth="10.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

PlaceholderAudio.displayName = 'PlaceholderAudio'

export default PlaceholderAudio
