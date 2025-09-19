import type { CellContext, DataType } from '../../table/types.js'

/**
 * Helper function to get text alignment classes based on column alignment
 */
export const getTextAlignmentClasses = <T extends DataType>(context: CellContext<T>) => ({
  'text-right': context.column.align === 'right',
  'text-center': context.column.align === 'center',
  'text-left': context.column.align === 'left' || !context.column.align,
})

/**
 * Helper function to get flexbox justify alignment classes based on column alignment
 */
export const getJustifyAlignmentClasses = <T extends DataType>(context: CellContext<T>) => ({
  'justify-end': context.column.align === 'right',
  'justify-center': context.column.align === 'center',
  'justify-start': context.column.align === 'left' || !context.column.align,
})
