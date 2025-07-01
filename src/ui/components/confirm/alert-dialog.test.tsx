import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.js'

describe('AlertDialog', () => {
  it('should render trigger button', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
  })

  it('should have correct data-slot attributes', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle data-testid="title">Test Title</AlertDialogTitle>
            <AlertDialogDescription data-testid="description">Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction data-testid="action">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('data-slot', 'alert-dialog-trigger')
  })

  it('should apply custom className to components', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger className="custom-trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogContent className="custom-content">
          <AlertDialogHeader className="custom-header">
            <AlertDialogTitle className="custom-title">Test Title</AlertDialogTitle>
            <AlertDialogDescription className="custom-description">Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="custom-footer">
            <AlertDialogCancel className="custom-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction className="custom-action">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.getByText('Open Dialog')).toHaveClass('custom-trigger')
  })
})
