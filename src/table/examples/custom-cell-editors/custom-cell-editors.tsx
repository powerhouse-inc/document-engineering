import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '../../../scalars/lib/utils.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import { ObjectSetTable } from '../../table/object-set-table.js'
import type { CellContext, ColumnDef, ObjectSetTableConfig } from '../../table/types.js'
import { buildStringCellEditor } from '../../components/default-cell-editors/string-editor.js'

const CustomTextInputEditor = ({
  value,
  onChange,
  context,
  placeholder,
  maxLength,
}: {
  value: unknown
  onChange: (newValue: unknown) => void
  context: CellContext<MockedPerson>
  placeholder?: string
  maxLength?: number
}) => {
  const { register } = useFormContext()
  const inputValue = typeof value === 'string' ? value : (value?.toString() ?? '')

  return (
    <input
      {...register(context.column.field, {
        value: inputValue,
        onChange,
        validate: (value) => {
          if (typeof value === 'string' && value.length > 10) {
            return 'Custom validation: Value must be less than 10 characters'
          }
          return true
        },
      })}
      type="text"
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus
      className={cn(
        'w-full px-2 py-1 text-sm border border-gray-300 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'bg-white text-gray-900 placeholder-gray-500'
      )}
    />
  )
}

CustomTextInputEditor.displayName = 'CustomTextInputEditor'

const CustomEmailInputEditor = ({
  value,
  onChange,
  context,
}: {
  value: unknown
  onChange: (newValue: unknown) => void
  context: CellContext<MockedPerson>
}) => {
  const { register } = useFormContext()
  const emailValue = typeof value === 'string' ? value : (value?.toString() ?? '')

  return (
    <input
      {...register(context.column.field, {
        value: emailValue,
        onChange,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      })}
      type="email"
      placeholder="Enter email address..."
      autoFocus
      className={cn(
        'w-full px-2 py-1 text-sm border border-gray-300 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'bg-white text-gray-900 placeholder-gray-500',
        'invalid:border-red-500 invalid:ring-red-500'
      )}
    />
  )
}

CustomEmailInputEditor.displayName = 'CustomEmailInputEditor'

// The Editors can be created using the CellEditor signature directly, but creating builders for them gives you the
// flexibility to reuse them with different parameters.
const buildCustomHTMLInputEditor = (placeholder?: string, maxLength?: number) => {
  const editor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<MockedPerson>) => {
    return (
      <CustomTextInputEditor
        value={value}
        onChange={onChange}
        context={context}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    )
  }
  editor.displayName = 'CustomHTMLInputEditor'
  return editor
}

const buildCustomEmailEditor = () => {
  const editor = (value: unknown, onChange: (newValue: unknown) => void, context: CellContext<MockedPerson>) => {
    return <CustomEmailInputEditor value={value} onChange={onChange} context={context} />
  }
  editor.displayName = 'CustomEmailEditor'
  return editor
}

const CustomCellEditorsExample = (props: Omit<ObjectSetTableConfig<MockedPerson>, 'columns' | 'data'>) => {
  const [data, setData] = useState<MockedPerson[]>(mockData)

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'First Name',
        editable: true,
        width: 160,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            setData((prevData) => {
              const newData = [...prevData]
              newData[context.rowIndex].firstName = value.trim()
              return newData
            })
            return true
          }
          return false
        },
        // Using custom HTML input editor instead of built-in StringField
        renderCellEditor: buildCustomHTMLInputEditor('Enter first name...', 50),
      },
      {
        field: 'email',
        title: 'Email',
        editable: true,
        width: 200,
        type: 'email',
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          if (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setData((prevData) => {
              const newData = [...prevData]
              newData[context.rowIndex].email = value
              return newData
            })
            return true
          }
          return false
        },
        // Using custom email input with validation
        renderCellEditor: buildCustomEmailEditor(),
      },
      {
        field: 'walletAddress',
        title: 'Wallet Address',
        editable: true,
        width: 200,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            setData((prevData) => {
              const newData = [...prevData]
              newData[context.rowIndex].walletAddress = value.trim()
              return newData
            })
            return true
          }
          return false
        },
        // Mixed: Using built-in scalar editor for comparison
        renderCellEditor: buildStringCellEditor({
          placeholder: 'Enter wallet address...',
          className: 'font-mono text-xs',
        }),
      },
      {
        field: 'payment',
        title: 'Payment',
        width: 120,
        type: 'number',
        editable: true,
        align: 'right',
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          const numValue = Number(value)
          if (!isNaN(numValue) && numValue >= 0) {
            setData((prevData) => {
              const newData = [...prevData]
              newData[context.rowIndex].payment = numValue
              return newData
            })
            return true
          }
          return false
        },
        renderCell: (value?: number) => {
          return value !== undefined ? <span className="font-mono">${value.toLocaleString()}</span> : null
        },
        // Using built-in number editor for simplicity
        renderCellEditor: buildStringCellEditor({
          placeholder: 'Enter amount...',
          className: 'text-right font-mono',
        }),
      },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Custom Cell Editors Example</h3>
        <p className="text-blue-800 text-sm">
          This example demonstrates custom cell editors using HTML inputs with react-hook-form&apos;s register()
          function. Compare the custom HTML inputs (First Name, Email) with the built-in scalar editor (Wallet Address).
        </p>
      </div>
      <ObjectSetTable<MockedPerson>
        columns={columns}
        data={data}
        minRowCount={5}
        maxRowCount={10}
        {...props}
        onDelete={(rows) => {
          setData((prevData) => {
            const newData = [...prevData]
            const filteredData = newData.filter((row) => !rows.some((person) => person.id === row.id))
            return filteredData
          })
        }}
        onAdd={(data) => {
          const newPerson: MockedPerson = {
            id: crypto.randomUUID(),
            firstName: '',
            status: 'inactive',
            payment: 0,
            isActive: false,
            walletAddress: '',
            email: '',
            address: {
              country: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              zip: '',
            },
            ...data,
          }
          setData((prevData) => [...prevData, newPerson])
        }}
      />
    </div>
  )
}

export default CustomCellEditorsExample
