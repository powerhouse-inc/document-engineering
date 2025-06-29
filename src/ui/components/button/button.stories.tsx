import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Icon as IconComponent } from '../icon/index.js'
import { Button } from './button.js'

/**
 * A flexible button component built with Radix UI Slot and class-variance-authority for consistent styling.
 * Perfect for forms, dialogs, navigation, and interactive elements throughout your application.
 *
 * ## Accessibility
 *
 * - Automatically includes proper focus management and keyboard navigation
 * - Use `aria-label` for icon-only buttons to provide screen reader context
 * - `disabled` state prevents interaction and is announced to assistive technology
 * - Focus-visible styles ensure keyboard navigation is clear
 *
 * ## Customization
 *
 * The component uses Tailwind CSS classes and can be customized via:
 * - `className` prop for additional styling
 * - CSS custom properties for theme-level changes
 * - Variant and size props for pre-defined styles
 */

const meta: Meta<typeof Button> = {
  title: 'Data Display/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual variant of the button',
      table: {
        type: { summary: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"' },
        defaultValue: { summary: '"default"' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      table: {
        type: { summary: '"default" | "sm" | "lg" | "icon"' },
        defaultValue: { summary: '"default"' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the button',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
    },
  },
  args: {
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <IconComponent name="DownloadFile" />
        Download
      </>
    ),
  },
}

export const IconTrailing: Story = {
  args: {
    children: (
      <>
        Continue
        <IconComponent name="Briefcase" />
      </>
    ),
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <IconComponent name="Reload" className="animate-spin" />
        Loading...
      </>
    ),
  },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    children: (
      <a href="#" target="_blank" rel="noopener noreferrer">
        External Link
      </a>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <IconComponent name="Settings" />
      </Button>
    </div>
  ),
}
