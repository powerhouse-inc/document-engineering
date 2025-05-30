import type { Props } from './types.js'

const M = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <path
        d="M1.88134 8.65644V18.3251H0V7.09336C0 6.19326 1.03474 5.68003 1.75748 6.22134L10.6938 12.912C10.9698 13.1179 11.1313 13.4409 11.1313 13.784V18.3235H9.24992V14.174L1.88134 8.65644Z"
        fill="currentcolor"
      />
      <path
        d="M22.0605 18.3251V8.65599L14.4616 14.1738V18.3251H12.5215V13.7854C12.5215 13.4422 12.688 13.1193 12.9726 12.9133L22.1882 6.22233C22.9335 5.67944 24.0006 6.19269 24.0006 7.09283V18.3251H22.0605Z"
        fill="currentcolor"
      />
    </svg>
  )
}

M.displayName = 'M'

export default M
