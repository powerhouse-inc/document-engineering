import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react'
import '../style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Scalars',
          ['Forms', 'Examples'],
          'Data Entry',
          'Data Display',
          [
            'Object Set Table',
            [
              '_Readme',
              'Docs',
              [
                'Column Definition',
                'Rows',
                'Cells',
                'Editing',
                'Cell Editors',
                'Adding',
                'Deletion',
                'Sorting',
                'Actions',
                'Events',
                'API',
                'Keyboard Shortcuts',
              ],
              'Examples',
            ],
          ],
          'Navigation',
          'Layout Components',
          'Fragments',
        ],
        method: 'alphabetical',
        includeNames: true,
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
