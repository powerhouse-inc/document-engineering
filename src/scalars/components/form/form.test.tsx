import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StringField } from '../string-field/index.js'
import { Form } from './form.js'
import { PasswordField } from '../password-field/index.js'
import { EmailField } from '../email-field/index.js'

describe('Form', () => {
  it('should render children as React nodes', () => {
    render(
      <Form onSubmit={() => undefined}>
        <div data-testid="child">Test Child</div>
      </Form>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should render children as function with form methods', () => {
    render(
      <Form onSubmit={() => undefined}>
        {(methods) => <div data-testid="child">{methods.formState.isSubmitting ? 'Submitting' : 'Not Submitting'}</div>}
      </Form>
    )
    expect(screen.getByTestId('child')).toHaveTextContent('Not Submitting')
  })

  it('should call onSubmit with form data', async () => {
    const handleSubmit = vi.fn()
    render(
      <Form onSubmit={handleSubmit}>
        <StringField name="test" defaultValue="test-value" />
        <button type="submit">Submit</button>
      </Form>
    )

    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        test: 'test-value',
      })
    })
  })

  it('should reset form after successful submit when resetOnSuccessfulSubmit is true', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(
      <Form onSubmit={handleSubmit} resetOnSuccessfulSubmit defaultValues={{ test: 'hello' }}>
        <StringField name="test" />
        <button type="submit">Submit</button>
      </Form>
    )

    // type something in the input
    const stringField = screen.getByRole('textbox')
    await user.type(stringField, ' world')

    expect(stringField).toHaveValue('hello world')

    const input = screen.getByRole('textbox')
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(input).toHaveValue('hello')
    })
  })

  it('should submit only changed values when submitChangesOnly is true', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()
    const defaultValues = { unchanged: 'default', changed: 'old' }

    render(
      <Form onSubmit={handleSubmit} defaultValues={defaultValues} submitChangesOnly>
        <StringField name="unchanged" />
        <StringField name="changed" />
        <button type="submit">Submit</button>
      </Form>
    )

    const changedInput = screen.getByDisplayValue('old')
    await user.clear(changedInput)
    await user.type(changedInput, 'new')
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        changed: 'new',
      })
    })
  })

  it('should submit null for empty values', async () => {
    const handleSubmit = vi.fn()
    render(
      <Form onSubmit={handleSubmit}>
        <StringField name="empty" />
        <button type="submit">Submit</button>
      </Form>
    )

    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        empty: null,
      })
    })
  })

  it('should apply className to form element', () => {
    render(
      // disable tailwind custom classname rule for this test

      <Form onSubmit={() => undefined} className="test-class">
        Test
      </Form>
    )
    expect(screen.getByText('Test')).toHaveClass('test-class')
  })

  describe('PasswordField with matchFieldName', () => {
    it('should not submit field when it has matchFieldName set', async () => {
      const handleSubmit = vi.fn()

      render(
        <Form onSubmit={handleSubmit}>
          <PasswordField name="password" defaultValue="@A1a" />
          <PasswordField name="confirmPassword" defaultValue="@A1a" matchFieldName="password" />
          <button type="submit">Submit</button>
        </Form>
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          password: '@A1a',
        })
      })
    })

    it('should submit fields when matchFieldName is not set', async () => {
      const handleSubmit = vi.fn()

      render(
        <Form onSubmit={handleSubmit}>
          <PasswordField name="password" defaultValue="@A1a" />
          <PasswordField name="confirmPassword" defaultValue="@A1a" />
          <button type="submit">Submit</button>
        </Form>
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          password: '@A1a',
          confirmPassword: '@A1a',
        })
      })
    })
  })

  describe('EmailField with matchFieldName', () => {
    it('should submit field when it has matchFieldName set', async () => {
      const handleSubmit = vi.fn()

      render(
        <Form onSubmit={handleSubmit}>
          <EmailField name="email" defaultValue="test@example.com" />
          <EmailField name="confirmEmail" defaultValue="test@example.com" matchFieldName="email" />
          <button type="submit">Submit</button>
        </Form>
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
        })
      })
    })

    it('should submit fields when matchFieldName is not set', async () => {
      const handleSubmit = vi.fn()

      render(
        <Form onSubmit={handleSubmit}>
          <EmailField name="email" defaultValue="test@example.com" />
          <EmailField name="confirmEmail" defaultValue="test@example.com" />
          <button type="submit">Submit</button>
        </Form>
      )

      fireEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          confirmEmail: 'test@example.com',
        })
      })
    })

    it('should show validation error when matchFieldName values do not match', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      render(
        <Form onSubmit={handleSubmit}>
          <EmailField name="email" label="Email" value="test@example.com" />
          <EmailField name="confirmEmail" label="Confirm Email" matchFieldName="email" showErrorOnBlur />
          <button type="submit">Submit</button>
        </Form>
      )

      const confirmInput = screen.getByLabelText('Confirm Email')
      await user.type(confirmInput, 'different@example.com')
      await user.tab()

      expect(screen.getByText('Email must match the "Email" field')).toBeInTheDocument()
    })
  })
})
