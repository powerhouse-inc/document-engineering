import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import { Icon } from "../icon/index.js";
import { cn } from "../../../scalars/index.js";
import { mockData, type MockedPerson } from "./mock-data.js";
import { ObjectSetTable } from "./object-set-table.js";

/**
 * The `ObjectSetTable` component is a powerful data table that displays collections of objects in a structured format.
 * It provides built-in support for row selection, inline editing, different cell types, and flexible column configuration.
 *
 * The table is built around the concept of **column definitions** that specify how data should be displayed, edited, and formatted.
 * Each column definition controls a specific aspect of the data presentation and behavior.
 *
 * ## Key Features
 *
 * - **Row Selection**: Multi-row selection with Ctrl/Cmd and Shift key support
 * - **Inline Editing**: Click cells to edit values directly in the table
 * - **Cell Types**: Built-in support for text, number, and boolean cell types
 * - **Custom Rendering**: Full control over cell rendering with custom components
 * - **Nested Field Access**: Access nested object properties using dot notation
 * - **Keyboard Navigation**: Navigate and edit cells using keyboard shortcuts
 * - **Row Numbers**: Optional row numbering with selection capabilities
 *
 * ## Column Definition
 *
 * The backbone of the `ObjectSetTable` is the `columns` prop, which defines how each column should behave:
 *
 * ```tsx
 * const columns: ColumnDef<DataType>[] = [
 *   {
 *     field: "firstName",           // Field path in data object
 *     title: "First Name",          // Column header (optional)
 *     type: "text",                 // Cell type: "text" | "number" | "boolean"
 *     editable: true,               // Allow inline editing
 *     width: "200px",               // Column width
 *     align: "left",                // Text alignment
 *   }
 * ];
 * ```
 *
 * ### Field Access
 *
 * Use dot notation to access nested properties:
 *
 * ```tsx
 * // Data structure
 * const data = {
 *   user: { name: "John", address: { city: "NYC" } }
 * };
 *
 * // Column definitions
 * { field: "user.name" }           // → "John"
 * { field: "user.address.city" }   // → "NYC"
 * ```
 *
 * ### Cell Types
 *
 * The table supports three built-in cell types:
 *
 * - **`text`** (default): Displays text values, editable with text input
 * - **`number`**: Right-aligned numbers, editable with number input
 * - **`boolean`**: Displays as checkbox, editable as checkbox
 *
 * ### Custom Cell Rendering
 *
 * Override default rendering with the `renderCell` function:
 *
 * ```tsx
 * {
 *   field: "status",
 *   renderCell: (value, context) => (
 *     <span className={value === "active" ? "text-green-600" : "text-red-600"}>
 *       {value}
 *     </span>
 *   )
 * }
 * ```
 *
 * ### Value Processing
 *
 * Control how values are extracted and formatted:
 *
 * ```tsx
 * {
 *   field: "price",
 *   valueGetter: (row) => row.price / 100,           // Convert cents to dollars
 *   valueFormatter: (value) => `$${value.toFixed(2)}`, // Format as currency
 *   renderCell: (formattedValue) => <strong>{formattedValue}</strong>
 * }
 * ```
 *
 * ### Editing and Saving
 *
 * Handle cell editing with the `onSave` callback:
 *
 * ```tsx
 * {
 *   field: "email",
 *   editable: true,
 *   onSave: (newValue, context) => {
 *     remoteSave(newValue); // save the value
 *   }
 * }
 * ```
 *
 * ## Usage
 *
 * Basic usage with simple column definitions:
 *
 * ```tsx
 * const data = [
 *   { id: 1, name: "John", email: "john@example.com", active: true },
 *   { id: 2, name: "Jane", email: "jane@example.com", active: false },
 * ];
 *
 * const columns = [
 *   { field: "name", editable: true },
 *   { field: "email", editable: true },
 *   { field: "active", type: "boolean" },
 * ];
 *
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   allowRowSelection={true}
 *   showRowNumbers={true}
 * />
 * ```
 *
 * ## Keyboard Shortcuts
 *
 * - **Click**: Select cell or start editing
 * - **Arrow Keys**: Navigate between cells
 * - **Enter**: Start/stop editing mode
 * - **Escape**: Cancel editing
 * - **Ctrl/Cmd + Click**: Toggle row selection
 * - **Shift + Click**: Select range of rows
 */
const meta: Meta<typeof ObjectSetTable> = {
  title: "Document Engineering/Data Display/Object Set Table",
  component: ObjectSetTable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    columns: {
      control: "object",
      description:
        "Array of column definitions that specify how data should be displayed and behave.",
      table: {
        type: {
          summary: "ColumnDef<T>[]",
        },
        readonly: true,
      },
    },
    data: {
      control: "object",
      description: "Array of data objects to display in the table.",
      table: {
        type: {
          summary: "T[]",
        },
        readonly: true,
      },
    },
    allowRowSelection: {
      control: "boolean",
      description:
        "Whether to allow row selection with mouse clicks and keyboard shortcuts.",
      table: {
        type: {
          summary: "boolean",
        },
        defaultValue: { summary: "true" },
      },
    },
    showRowNumbers: {
      control: "boolean",
      description: "Whether to show row numbers in the leftmost column.",
      table: {
        type: {
          summary: "boolean",
        },
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ObjectSetTable<MockedPerson>>;

/**
 * A simple read-only table without row selection or editing capabilities.
 * Perfect for displaying data that doesn't need to be modified.
 */
export const ReadOnly: Story = {
  args: {
    columns: [
      { field: "firstName", title: "First Name" },
      { field: "email", title: "Email Address" },
      { field: "payment", type: "number", title: "Payment" },
      { field: "status", title: "Status" },
    ],
    data: mockData.slice(0, 4),
    allowRowSelection: false,
    showRowNumbers: false,
  },
};

/**
 * Demonstrates different cell types and their default rendering.
 * Shows how text, number, and boolean types are displayed differently.
 */
export const CellTypes: Story = {
  args: {
    columns: [
      { field: "firstName", type: "text", title: "Text Field" },
      { field: "payment", type: "number", title: "Number Field" },
      { field: "isActive", type: "boolean", title: "Boolean Field" },
    ],
    data: mockData.slice(0, 5),
  },
};
