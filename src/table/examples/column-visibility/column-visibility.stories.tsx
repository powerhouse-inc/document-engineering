import type { Meta, StoryObj } from '@storybook/react'
import ColumnVisibilityExample from './column-visibility.js'

const meta = {
  title: 'Data Display/Object Set Table/Examples/Column Visibility',
  component: ColumnVisibilityExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        code: `
import { useMemo, useState } from "react";
import { ObjectSetTable } from "@powerhousedao/document-engineering/table";
import type { ColumnDef } from "@powerhousedao/document-engineering/table";
import { Button } from "@powerhousedao/document-engineering/ui";
import { Icon } from "@powerhousedao/document-engineering/ui";

// Mock data for the example
const mockData = [
  { firstName: "John", email: "john@example.com", status: "active", payment: "1200", isActive: true },
  { firstName: "Jane", email: "jane@example.com", status: "inactive", payment: "800", isActive: false },
  { firstName: "Bob", email: "bob@example.com", status: "active", payment: "1500", isActive: true },
  { firstName: "Alice", email: "alice@example.com", status: "active", payment: "900", isActive: true },
  { firstName: "Charlie", email: "charlie@example.com", status: "inactive", payment: "1100", isActive: false },
  { firstName: "Diana", email: "diana@example.com", status: "active", payment: "1300", isActive: true },
];

type MockedPerson = typeof mockData[0];

const ColumnVisibilityExample = () => {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(['email']);

  const toggleColumn = (field: string) => {
    setHiddenColumns(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'Name',
        width: 140,
        hidden: hiddenColumns.includes('firstName'),
      },
      {
        field: 'email',
        title: 'Email',
        width: 200,
        hidden: hiddenColumns.includes('email'),
      },
      {
        field: 'status',
        title: 'Status',
        width: 120,
        hidden: hiddenColumns.includes('status'),
      },
      {
        field: 'payment',
        title: 'Payment',
        width: 120,
        type: 'number',
        hidden: hiddenColumns.includes('payment'),
        align: 'right',
      },
      {
        field: 'isActive',
        title: 'Active',
        width: 80,
        hidden: hiddenColumns.includes('isActive'),
      },
    ],
    [hiddenColumns]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Column Visibility Demo</h3>
        <p className="text-sm text-blue-700 mb-3">
          Toggle column visibility to show/hide columns dynamically. The table maintains consistent 
          column indices and API functionality even when columns are hidden.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {columns.map((option) => (
            <Button
              key={option.field}
              variant={hiddenColumns.includes(option.field) ? 'secondary' : 'default'}
              size="sm"
              onClick={() => toggleColumn(option.field)}
              className="flex items-center gap-2"
            >
              <Icon 
                name={hiddenColumns.includes(option.field) ? 'Show' : 'Hide'} 
                size={14} 
              />
              {option.title}
            </Button>
          ))}
        </div>
      </div>
      
      <ObjectSetTable<MockedPerson>
        columns={columns}
        data={mockData.slice(0, 6)}
        allowRowSelection={true}
        showRowNumbers={true}
      />
    </div>
  );
};

export default ColumnVisibilityExample;
        `,
      },
    },
  },
} satisfies Meta<typeof ColumnVisibilityExample>

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export default meta
