import type { Meta, StoryObj } from '@storybook/react'
import RowReorderingExample from './row-reordering.js'

const meta = {
  title: 'Data Display/Object Set Table/Examples/Row Reordering',
  component: RowReorderingExample,
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
import { cn } from "../../../scalars/index.js";
import { mockData, type MockedPerson } from "../../table/mock-data.js";
import { ObjectSetTable } from "../../table/object-set-table.js";
import type { ColumnDef, ObjectSetTableConfig } from "../../table/types.js";
import { Icon } from "../../../ui/components/icon/icon.js";

const RowReorderingExample = () => {
  const [data, setData] = useState<MockedPerson[]>(mockData.slice(0, 6));

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: "firstName",
        title: "Name",
        width: 140,
        renderCell: (value: string) => (
          <div className="flex items-center gap-2">
            <Icon name="Person" size={16} className="text-gray-500" />
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        field: "email",
        title: "Email",
        width: 200,
        renderCell: (value: string) => (
          <span className="text-gray-600">{value}</span>
        ),
      },
      {
        field: "status",
        title: "Status",
        width: 120,
        renderCell: (value: "active" | "inactive") => (
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", value === "active" ? "bg-green-500" : "bg-red-500")} />
            <span className={cn("text-xs font-medium", value === "active" ? "text-green-700" : "text-red-700")}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </div>
        ),
      },
      {
        field: "payment",
        title: "Payment",
        width: 120,
        type: "number",
        align: "right",
        renderCell: (value: string) => (
          <span className="font-mono text-gray-900">\${value}</span>
        ),
      },
    ],
    []
  );

  const handleReorder = (rows: MockedPerson[], targetRowIndex: number) => {
    setData((prevData) => {
      const newData = [...prevData];
      const rowsToMove = rows.map((row) => newData.findIndex((item) => item.id === row.id));
      const sourceIndex = rowsToMove[0]; // Handle single row moves
      
      if (sourceIndex === -1 || sourceIndex === targetRowIndex) return newData;
      
      // Remove the item from its current position
      const [movedItem] = newData.splice(sourceIndex, 1);
      
      // Insert it at the target position
      const insertIndex = sourceIndex < targetRowIndex ? targetRowIndex - 1 : targetRowIndex;
      newData.splice(insertIndex, 0, movedItem);
      
      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Row Reordering Demo</h3>
        <p className="text-sm text-blue-700">
          Drag and drop rows to reorder them. The table data will update automatically.
        </p>
      </div>
      
      <ObjectSetTable<MockedPerson>
        columns={columns}
        data={data}
        onReorder={handleReorder}
        allowRowSelection={true}
        showRowNumbers={true}
      />
    </div>
  );
};

export default RowReorderingExample;
        `,
      },
    },
  },
} satisfies Meta<typeof RowReorderingExample>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple demonstration of row reordering functionality using drag and drop.
 * Drag any row to a new position to reorder the data. The changes persist in the component state.
 */
export const Default: Story = {
  args: {},
}

/**
 * Row reordering with row numbers disabled.
 * This example shows how reordering works without row number indicators.
 */
export const WithoutRowNumbers: Story = {
  args: {
    showRowNumbers: false,
  },
}

/**
 * Row reordering with selection disabled.
 * Users can still reorder rows even when row selection is disabled.
 */
export const WithoutSelection: Story = {
  args: {
    allowRowSelection: false,
  },
}
