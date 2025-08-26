import { Icon } from '../../components/icon/index.js'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useState } from 'react'
import mockedTree from './mocked_tree.json'
import { Sidebar } from './sidebar.js'
import { SidebarProvider } from './subcomponents/sidebar-provider/index.js'
import type { SidebarNode } from './types.js'

/**
 * The `Sidebar` component can be used within a page layout to provide a sidebar navigation.
 * It provided a tree structure of nodes that can be used to navigate the application offering customization, search and more.
 *
 * The `Sidebar` component requires a `SidebarProvider` ancestor component to function correctly. The `SidebarProvider` accepts an optional `nodes` prop
 * which defines the navigation tree structure. If `nodes` is not provided to the provider, the `Sidebar` component can accept its own `nodes` prop.
 * If neither source provides nodes, the sidebar will render empty.
 *
 * Usage:
 *
 * ```tsx
 * <SidebarProvider nodes={nodes}>
 *   <Sidebar {...sidebarProps} />
 * </SidebarProvider>
 * ```
 *
 * The sidebar nodes are defined as follows:
 *
 * ```tsx
 * type SidebarNode = {
 *   id: string;
 *   title: string;
 *   children: SidebarNode[];
 *   icon?: IconName | ReactElement;
 *   expandedIcon?: IconName | ReactElement;
 *   status?: NodeStatus;
 * };
 * enum NodeStatus {
 *   CREATED = "CREATED",
 *   MODIFIED = "MODIFIED",
 *   REMOVED = "REMOVED",
 *   MOVED = "MOVED",
 *   DUPLICATED = "DUPLICATED",
 *   UNCHANGED = "UNCHANGED", // default status, no need to set it
 * }
 * ```
 *
 * The `icon` and `expandedIcon` properties are optional and can be used to display an icon in the sidebar item.
 * This icons must be one of the [available icons](?path=/docs/powerhouse-iconography--readme)
 *
 * ## Sidebar Events
 *
 * The `Sidebar` component emits the following custom events:
 *
 * - `sidebar:change`: it is triggered when the sidebar item is clicked.
 *  - Data: `{ node: SidebarNode }`
 * - `sidebar:resize:start`: it is triggered when the sidebar resize starts at the moment the user clicks down in the resizing handle.
 *  - Data: `{ isSidebarOpen: boolean }`
 * - `sidebar:resize:active`: it is triggered when the sidebar is being resized while the user is dragging the resizing handle.
 * It could be triggered multiple times while the user is dragging the resizing handle.
 *  - Data: `{ isSidebarOpen: boolean, sidebarWidth: number }`
 * - `sidebar:resize`: it is triggered when the sidebar resize stops at the moment the user releases the resizing handle.
 *  - Data: `{ isSidebarOpen: boolean, sidebarWidth: number }`
 * - `sidebar:resize:toggle`: it is triggered when the sidebar is toggled (collapsed or expanded).
 *  - Data: `{ isSidebarOpen: boolean }`
 *
 * ### Example of listening to the events
 *
 * ```tsx
 * useEffect(() => {
 *   const onResize = (event: Event) => {
 *     console.log("sidebar:resize", event);
 *   };
 *
 *   // you can add the listener directly to the document or add a
 *   // `className`, get the sidebar element and add the listener to it.
 *   document.addEventListener("sidebar:resize", onResize);
 *
 *   return () => {
 *     document.removeEventListener("sidebar:resize", onResize);
 *   };
 * }, []);
 * ```
 */
const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider nodes={mockedTree as SidebarNode[]}>
        <Story />
      </SidebarProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    activeNodeId: {
      control: 'text',
      description: 'The id of the node that is currently active.',
    },
    nodes: {
      control: 'object',
      table: {
        readonly: true,
      },
      description:
        'The nodes to be displayed in the sidebar. It can be provided through the SidebarProvider to prevent flickering.',
    },
    sidebarTitle: {
      control: 'text',
      description: 'The title of the sidebar.',
    },
    sidebarIcon: {
      control: 'object',
      table: {
        readonly: true,
      },
      description: 'The icon of the sidebar.',
    },
    defaultLevel: {
      control: 'number',
      description: 'The level to be opened by default.',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    enableMacros: {
      control: 'number',
      description: 'The number of macros to be displayed in the sidebar. Recommended up to 4.',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    allowPinning: {
      control: 'boolean',
      description: 'Whether the sidebar items can be pinned.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the sidebar is resizable.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showSearchBar: {
      control: 'boolean',
      description: 'Whether the sidebar allows searching.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showStatusFilter: {
      control: 'boolean',
      description: 'Whether the sidebar allows filtering by status.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    extraFooterContent: {
      control: 'object',
      description: 'Additional content to be displayed in the sidebar footer.',
      table: {
        readonly: true,
      },
    },
    initialWidth: {
      control: 'number',
      description: 'The initial width of the sidebar.',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    maxWidth: {
      control: 'number',
      description: 'The maximum width of the sidebar.',
    },
    allowCollapsingInactiveNodes: {
      control: 'boolean',
      description: 'Whether to allow collapsing inactive nodes on click.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    handleOnTitleClick: {
      control: false,
      description:
        'Callback function triggered when the sidebar title is clicked. Use this to implement custom navigation logic.',
      table: {
        readonly: true,
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the sidebar is in a loading state, displaying skeleton items instead of actual content.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    nodeSortType: {
      control: 'select',
      options: ['none', 'alphabetical', 'natural', 'custom'],
      description: 'The type of sorting to apply to all nodes recursively. Affects all levels of the tree hierarchy.',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    nodeSortOrder: {
      control: 'select',
      options: ['asc', 'desc'],
      description:
        'The sort order direction for nodes (ascending or descending). Only applicable when nodeSortType is not "none" or undefined.',
      table: {
        defaultValue: { summary: 'asc' },
      },
      if: { arg: 'nodeSortType', neq: 'none' },
    },
    nodeSortCompareFn: {
      control: false,
      description: 'Custom comparison function for sorting nodes. Required when nodeSortType is "custom".',
      table: {
        readonly: true,
        type: { summary: '(valueA: string, valueB: string) => -1 | 0 | 1' },
      },
    },
  },
  args: {
    sidebarTitle: 'Title Sidebar',
    sidebarIcon: (
      <div className="flex items-center justify-center rounded-md bg-gray-900 p-2">
        <Icon name="M" className="text-gray-50" size={16} />
      </div>
    ),
    enableMacros: 4,
    onActiveNodeChange: (node) => {
      console.log('onActiveNodeChange', node)
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {}

/**
 * The `Sidebar` component can be used within a page layout to provide a sidebar navigation.
 * It can also be used to display additional content within the sidebar, such as authentication buttons.
 * or any other react component.
 */
export const WithinLayoutAndContent: Story = {
  args: {
    showStatusFilter: true,
  },
  render: function WithinLayoutAndContentRender(args) {
    const [activeNode, setActiveNode] = useState<string>('4281ab93-ef4f-4974-988d-7dad149a693d')

    const onActiveNodeChange = useCallback((node: SidebarNode) => {
      setActiveNode(node.id)
    }, [])

    return (
      <main className="flex h-svh w-full">
        <Sidebar
          className="sidebar"
          {...args}
          onActiveNodeChange={onActiveNodeChange}
          activeNodeId={activeNode}
          extraFooterContent={
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2 text-gray-900 dark:text-gray-200">
                <div>Login with</div>
                <Icon name="Renown" size="auto" height={18} className="cursor-pointer" />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Auth integration example within sidebar content
              </div>
            </div>
          }
        />
        <div style={{ width: 'calc(100% - var(--sidebar-width))' }} className="flex-1 bg-gray-50 p-4 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Content Area</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Node: {activeNode}</p>
        </div>
      </main>
    )
  },
}

/**
 * Example showing how to use the `handleOnTitleClick` callback to implement custom navigation.
 * This allows developers to make the sidebar title clickable for custom navigation logic.
 */
export const WithCustomTitleNavigation: Story = {
  args: {
    showStatusFilter: true,
  },
  render: function WithCustomTitleNavigationRender(args) {
    const [activeNode, setActiveNode] = useState<string>('4281ab93-ef4f-4974-988d-7dad149a693d')
    const [navigationLog, setNavigationLog] = useState<string[]>([])

    const onActiveNodeChange = useCallback((node: SidebarNode) => {
      setActiveNode(node.id)
    }, [])

    const handleTitleClick = useCallback(() => {
      const timestamp = new Date().toLocaleTimeString()
      setNavigationLog((prev) => [...prev, `Title clicked at ${timestamp} - Navigate to root/home`])
    }, [])

    return (
      <main className="flex h-svh w-full">
        <Sidebar
          className="sidebar"
          {...args}
          onActiveNodeChange={onActiveNodeChange}
          activeNodeId={activeNode}
          handleOnTitleClick={handleTitleClick}
          sidebarTitle="Click me to go home!"
        />
        <div style={{ width: 'calc(100% - var(--sidebar-width))' }} className="flex-1 bg-gray-50 p-4 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Content Area</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Node: {activeNode}</p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Navigation Log:</h2>
            <div className="mt-2 overflow-y-auto rounded border p-2 bg-white dark:bg-slate-700">
              {navigationLog.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the sidebar title to see navigation events
                </p>
              ) : (
                <ul className="text-sm text-gray-700 dark:text-gray-300">
                  {navigationLog.map((log, index) => (
                    <li key={index} className="py-1">
                      {log}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  },
}

/**
 * Demonstrates the loading state of the sidebar when data is being fetched.
 * The sidebar displays skeleton items with animated placeholders while preserving
 * all other functionality like header, search bar, and footer content.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    showStatusFilter: true,
  },
  render: function LoadingRender(args) {
    const [isLoading, setIsLoading] = useState(true)

    return (
      <main className="flex h-svh w-full">
        <Sidebar className="sidebar" {...args} isLoading={isLoading} />
        <div style={{ width: 'calc(100% - var(--sidebar-width))' }} className="flex-1 bg-gray-50 p-4 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Content Area</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sidebar Status: {isLoading ? 'Loading...' : 'Ready'}
          </p>

          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoading(!isLoading)
                }}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              >
                {isLoading ? 'Stop Loading' : 'Start Loading'}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Toggle loading state to see the skeleton animation
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  },
}

/**
 * Demonstrates how to use a custom sorting function for nodes.
 * This example shows sorting by string length (shorter titles first) then alphabetically if lengths are equal.
 */
export const WithCustomSorting: Story = {
  args: {
    nodeSortType: 'custom',
    nodeSortOrder: 'asc',
    defaultLevel: 2,
  },
  render: function WithCustomSortingRender(args) {
    // Custom sorting function that sorts by title length first, then alphabetically
    const customSortFunction = useCallback((valueA: string, valueB: string): -1 | 0 | 1 => {
      const lengthComparison = valueA.length - valueB.length
      if (lengthComparison !== 0) {
        return lengthComparison < 0 ? -1 : 1
      }
      // If lengths are equal, sort alphabetically
      const alphabetical = valueA.toLowerCase().localeCompare(valueB.toLowerCase())
      return alphabetical < 0 ? -1 : alphabetical > 0 ? 1 : 0
    }, [])

    return (
      <main className="flex h-svh w-full">
        <Sidebar className="sidebar" {...args} nodeSortCompareFn={customSortFunction} />
        <div style={{ width: 'calc(100% - var(--sidebar-width))' }} className="flex-1 bg-gray-50 p-4 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Custom Sorting</h1>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>nodeSortType:</strong> {`"${args.nodeSortType}"`}
            </p>
            <p>
              <strong>nodeSortOrder:</strong> {`"${args.nodeSortOrder}"`}
            </p>
            <p>
              <strong>nodeSortCompareFn:</strong> Sorts by string length, then alphabetically if lengths are equal
            </p>
          </div>
        </div>
      </main>
    )
  },
}
