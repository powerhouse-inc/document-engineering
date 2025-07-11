import { useEffect, useMemo, useState } from 'react'
import { debounce, zxcvbnAsync, zxcvbnOptions, type ZxcvbnResult } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { cn } from '../../../../scalars/lib/index.js'
import { ProgressBar } from '../../../../scalars/components/fragments/progress-bar/index.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/index.js'
import { specialCharacters, strengthColors, strengthLabels, strengthValues } from './utils.js'

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  useLevenshteinDistance: true,
}
zxcvbnOptions.setOptions(options)

const PasswordStrength = ({ password }: { password: string }) => {
  const [result, setResult] = useState<ZxcvbnResult | undefined>(undefined)
  const [wasEmpty, setWasEmpty] = useState(password === '')

  const debouncedZxcvbn = useMemo(
    () =>
      debounce(async (passwordToCheck: string) => {
        try {
          const response = await zxcvbnAsync(passwordToCheck)
          setResult(response)
        } catch (error) {
          console.error('Error calculating password strength: ', error)
          setResult(undefined)
        }
      }, 200),
    []
  )

  useEffect(() => {
    if (password === '') {
      setWasEmpty(true)
    }
    debouncedZxcvbn(password)
  }, [password, debouncedZxcvbn])

  useEffect(() => {
    if (password !== '' && result !== undefined) {
      setWasEmpty(false)
    }
  }, [password, result])

  const score = result?.score
  const showWeak = password === '' || (score === undefined && wasEmpty)

  return (
    <div className={cn('w-full flex flex-col gap-4 px-4 pt-2 pb-4 rounded-md')}>
      <div className={cn('w-full flex flex-col gap-2')}>
        <h3 className={cn('text-sm font-semibold text-gray-900')}>Password strength</h3>

        <ProgressBar
          value={score !== undefined ? strengthValues[score] : showWeak ? strengthValues[0] : 0}
          className={cn(
            score !== undefined
              ? strengthColors[score]
              : showWeak
                ? strengthColors[0]
                : '[&_[data-slot=progress-bar-indicator]]:bg-transparent'
          )}
        />

        <span className={cn('h-4 text-xs font-medium text-gray-600')}>
          {score !== undefined ? strengthLabels[score] : showWeak ? strengthLabels[0] : ''}
        </span>
      </div>

      <hr className={cn('w-full border-t border-gray-300')} />

      <div className={cn('w-full flex flex-col gap-4')}>
        <h4 className={cn('text-sm leading-[18px] font-medium text-gray-500')}>Suggestions</h4>
        <FormMessageList
          messages={[
            'Minimum 8 characters',
            'At least one uppercase letter',
            'At least one lowercase letter',
            'At least one number',
            `At least one special character: ${specialCharacters}`,
          ]}
          className={cn('gap-2 [&>li]:text-gray-500 [&>li]:before:bg-gray-500')}
        />
      </div>
    </div>
  )
}

export { PasswordStrength }
