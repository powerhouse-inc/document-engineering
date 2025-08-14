import type { Meta, StoryObj } from '@storybook/react'
import TableEditingExample from './table-editing.js'

const meta = {
  title: 'Data Display/Object Set Table/Examples/Table Editing',
  component: TableEditingExample,
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
import { cn, EnumField } from "../../../scalars/index.js";
import { mockData, type MockedPerson } from "../../table/mock-data.js";
import { ObjectSetTable } from "../../table/object-set-table.js";
import type { CellContext, ColumnDef, ObjectSetTableConfig, RowContext } from "../../table/types.js";
import { Icon } from "../../../ui/components/icon/icon.js";
import { confirm } from "../../../ui/components/confirm/confirm.js";

const TableEditingExample = () => {
  const [data, setData] = useState<MockedPerson[]>(mockData);

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: "firstName",
        title: "User",
        editable: true,
        sortable: true,
        width: 140,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData];
            newData[context.rowIndex].firstName = value as string;
            return newData;
          });
          return true;
        },
      },
      {
        field: "status",
        width: 130,
        editable: false,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData];
            newData[context.rowIndex].status = value as "active" | "inactive";
            return newData;
          });
          return true;
        },
        renderCell: (value?: "active" | "inactive") =>
          !value ? null : (
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", value === "active" ? "bg-green-500" : "bg-red-500")} />
              <span className={cn("font-medium", value === "active" ? "text-green-700" : "text-red-700")}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            </div>
          ),
      },
      {
        field: "payment",
        width: 140,
        type: "number",
        editable: true,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData];
            newData[context.rowIndex].payment = value as number;
            return newData;
          });
          return true;
        },
      },
    ],
    []
  );

  return (
    <ObjectSetTable<MockedPerson>
      columns={columns}
      data={data}
      minRowCount={10}  // Ensures table shows at least 10 rows
      maxRowCount={15}  // Prevents adding more than 15 rows
      onDelete={(rows) => {
        setData((prevData) => {
          const newData = [...prevData];
          return newData.filter((row) => !rows.some((person) => person.id === row.id));
        });
      }}
      onAdd={(data) => {
        const newPerson: MockedPerson = {
          id: crypto.randomUUID(),
          firstName: "",
          status: "inactive",
          payment: 0,
          isActive: false,
          walletAddress: "",
          email: "",
          address: {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zip: "",
          },
          ...data,
        };
        setData((prevData) => [...prevData, newPerson]);
      }}
    />
  );
};

export default TableEditingExample;
        `,
      },
    },
  },
} satisfies Meta<typeof TableEditingExample>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default editing example with minRowCount and maxRowCount configured.
 * This table ensures a minimum of 10 rows are always visible and limits adding to a maximum of 15 rows.
 */
export const Default: Story = {
  args: {},
}

/**
 * Demonstrates minRowCount behavior with a small dataset.
 * Even with only 3 data items, the table displays 8 rows (5 empty placeholder rows are added).
 */
export const MinRowCountDemo: Story = {
  args: {
    minRowCount: 8,
    maxRowCount: 20,
  },
}

/**
 * Demonstrates maxRowCount behavior by limiting the table to 12 rows maximum.
 * Once 12 rows are reached, the add functionality becomes disabled.
 * Try adding rows until you reach the limit to see the behavior.
 */
export const MaxRowCountDemo: Story = {
  args: {
    minRowCount: 5,
    maxRowCount: 12,
  },
}

/**
 * Shows a table with no row count restrictions.
 * Uses default values: minRowCount = 0 (no empty rows) and maxRowCount = Infinity (unlimited).
 */
export const UnrestrictedRowCount: Story = {
  args: {
    minRowCount: 0,
    maxRowCount: undefined, // Uses default Infinity
  },
}
