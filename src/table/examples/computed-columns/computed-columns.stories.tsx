import type { Meta, StoryObj } from '@storybook/react'
import ComputedColumnsExample from './computed-columns.js'

const meta = {
  title: 'Data Display/Object Set Table/Examples/Computed Columns',
  component: ComputedColumnsExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        code: `
import { useMemo } from "react";
import { cn } from "../../../../scalars/index.js";
import { mockData, type MockedPerson } from "../mock-data.js";
import { ObjectSetTable } from "../object-set-table.js";
import { ColumnDef } from "../types.js";

const ComputedColumnsExample = () => {
  const columns = useMemo<ColumnDef<MockedPerson>[]>(
    () => [
      { field: "firstName", title: "Name" },
      {
        field: "email",
        title: "Email Domain",
        valueFormatter: (value) => {
          if (typeof value !== "string") return value?.toString() ?? "N/A";
          return value?.toString().split("@")[1];
        },
      },
      {
        field: "payment",
        title: "Payment Category",
        valueFormatter: (value: unknown) => {
          if (typeof value !== "number") return value?.toString() ?? "N/A";
          if (value === 0) return "No Payment";
          if (value < 1000) return "Low";
          if (value < 100000) return "Medium";
          return "High";
        },
        renderCell: (value: string) => (
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              (value === "No Payment" || value === "N/A") &&
                "bg-gray-100 text-gray-700",
              value === "Low" && "bg-yellow-100 text-yellow-700",
              value === "Medium" && "bg-blue-100 text-blue-700",
              value === "High" && "bg-green-100 text-green-700"
            )}
          >
            {value}
          </span>
        ),
      },
      {
        field: "address",
        title: "Full Address",
        valueFormatter: (value) => {
          const addr = value as MockedPerson["address"];
          return \`\${addr.addressLine1}, \${addr.city}, \${addr.state} \${addr.zip}\`;
        },
      },
    ],
    []
  );

  return (
    <ObjectSetTable<MockedPerson>
      columns={columns}
      data={mockData.slice(0, 6)}
      allowRowSelection={true}
      showRowNumbers={true}
    />
  );
};

export default ComputedColumnsExample;
        `,
      },
    },
  },
} satisfies Meta<typeof ComputedColumnsExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
