import type { Meta, StoryObj } from "@storybook/react";
import CustomRenderingExample from "./custom-rendering.js";

const meta = {
  title: "Document Engineering/Data Display/Object Set Table/2 - Examples/Custom Rendering",
  component: CustomRenderingExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      source: {
        language: "tsx",
        format: true,
        code: `
import { useMemo } from "react";
import { cn } from "../../../../../scalars/index.js";
import { mockData, type MockedPerson } from "../../mock-data.js";
import { ObjectSetTable } from "../../object-set-table.js";
import { ColumnDef } from "../../types.js";
import { Icon } from "../../../icon/icon.js";

const CustomRenderingExample = () => {
  const columns = useMemo<ColumnDef<MockedPerson>[]>(
    () => [
        {
          field: "firstName",
          title: "User",
          renderCell: (value: string, context) => (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                {value.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{value}</span>
            </div>
          ),
        },
        {
          field: "status",
          renderCell: (value: "active" | "inactive") => (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  value === "active" ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  value === "active" ? "text-green-700" : "text-red-700"
                )}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            </div>
          ),
        },
        {
          field: "payment",
          type: "number",
          renderCell: (value: number) => (
            <div className="flex items-center justify-end">
              <span className="font-semibold text-gray-900">
                \${value.toLocaleString()}
              </span>
              {value > 1000000 ? (
                <Icon name="ArrowUp" size={16} className="ml-1 text-green-500" />
              ) : (
                <Icon
                  name="ArrowUp"
                  size={16}
                  className="ml-1 text-red-500 rotate-180"
                />
              )}
            </div>
          ),
        },
        {
          field: "isActive",
          title: "Active",
          renderCell: (value: boolean) => (
            <div className="flex justify-center">
              {value ? (
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              ) : (
                <Icon name="CrossCircle" size={20} className="text-red-500" />
              )}
            </div>
          ),
        },
      ],
    []
  );

  return (
    <ObjectSetTable<MockedPerson>
      columns={columns}
      data={mockData.slice(0, 6)}
    />
  );
};

export default CustomRenderingExample;
        `,
      },
    },
  },
} satisfies Meta<typeof CustomRenderingExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
