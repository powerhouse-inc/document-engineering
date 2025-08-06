'use client'

import React from 'react'
import { TextField, type TextFieldProps } from '../fragments/text-field/index.js'
import { TextareaField, type TextareaFieldProps } from '../fragments/textarea-field/index.js'

interface StringFieldProps extends Omit<TextFieldProps, keyof TextareaFieldProps>, TextareaFieldProps {}

const StringField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, StringFieldProps>(
  ({ autoExpand, multiline, ...props }, ref) => {
    if (autoExpand || multiline) {
      // only textarea supports autoExpand and multiline
      return (
        <TextareaField
          autoExpand={autoExpand}
          multiline={multiline}
          {...(props as TextareaFieldProps)}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        />
      )
    }

    return <TextField {...(props as TextFieldProps)} ref={ref as React.ForwardedRef<HTMLInputElement>} />
  }
)

StringField.displayName = 'StringField'

export { StringField, type StringFieldProps }
