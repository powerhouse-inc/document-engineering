import React from 'react'
import { RadioGroupField, type RadioGroupFieldProps } from '../fragments/radio-group-field/index.js'
import { SelectField, type SelectFieldProps } from '../fragments/select-field/index.js'

type EnumFieldProps =
  | ({
      variant?: 'auto'
    } & (RadioGroupFieldProps | SelectFieldProps))
  | ({
      variant: 'RadioGroup'
    } & RadioGroupFieldProps)
  | ({
      variant: 'Select'
    } & SelectFieldProps)

const EnumField = React.forwardRef<HTMLDivElement | HTMLButtonElement, EnumFieldProps>(
  ({ variant = 'auto', options = [], ...props }, ref) => {
    const radio = (
      <RadioGroupField
        options={options}
        {...(props as RadioGroupFieldProps)}
        ref={ref as React.ForwardedRef<HTMLDivElement>}
      />
    )
    const select = (
      <SelectField
        options={options}
        {...(props as SelectFieldProps)}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
      />
    )

    switch (variant) {
      case 'RadioGroup':
        return radio
      case 'Select':
        return select
      case 'auto': {
        const favoriteOptionsLength =
          'favoriteOptions' in props && props.favoriteOptions !== undefined ? props.favoriteOptions.length : 0
        return options.length + favoriteOptionsLength < 6 ? radio : select
      }
    }
  }
)

EnumField.displayName = 'EnumField'

export { EnumField, type EnumFieldProps }
