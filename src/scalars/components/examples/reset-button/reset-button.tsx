import { Button } from '../../../../ui/components/button/index.js'
import { Form } from '../../form/index.js'
import { NumberField } from '../../number-field/index.js'
import { StringField } from '../../string-field/index.js'

const FormWithResetButton = () => {
  return (
    <Form
      onSubmit={(data: FormData) => {
        // eslint-disable-next-line no-alert
        alert(JSON.stringify(data, null, 2))
      }}
    >
      {({ reset }) => (
        <div className="flex flex-col gap-2">
          <StringField name="example" minLength={3} maxLength={6} label="Field example" required />
          <NumberField name="number" label="Number" required />

          <div className="w-72 text-sm text-gray-500">
            Clicking reset will restore all form fields and validation states to their initial values
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" variant="secondary" type="reset" onClick={reset}>
              Reset
            </Button>
            <Button className="flex-1" type="submit">
              Submit
            </Button>
          </div>
        </div>
      )}
    </Form>
  )
}

export default FormWithResetButton
