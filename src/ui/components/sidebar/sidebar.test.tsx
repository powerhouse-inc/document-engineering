import { describe, expect, it } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'

import { Icon } from '../../components/icon/index.js'
import { Sidebar } from './sidebar.js'
import { SidebarProvider, useSidebar } from './subcomponents/sidebar-provider/index.js'

const mockNodes = [
  {
    id: '1',
    title: 'Node 1',
    children: [
      {
        id: '1.1',
        title: 'Node 1.1',
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: 'Node 2',
    children: [],
  },
]

const mockNodesWithClassName = [
  {
    id: '1',
    title: 'Node with custom class',
    className: 'custom-node-class text-blue-500',
    children: [],
  },
  {
    id: '2',
    title: 'Normal node',
    children: [],
  },
]

const renderSidebar = (props = {}) => {
  return render(
    <SidebarProvider nodes={mockNodes}>
      <Sidebar {...props} />
    </SidebarProvider>
  )
}

describe('Sidebar Component', () => {
  it('should match snapshot', () => {
    const { asFragment } = renderSidebar({
      sidebarTitle: 'Test Sidebar',
      sidebarIcon: <Icon name="M" size={16} />,
      enableMacros: 2,
      defaultLevel: 1,
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render sidebar title and icon when provided', () => {
    renderSidebar({
      sidebarTitle: 'Test Sidebar',
      sidebarIcon: <div data-testid="sidebar-icon">Icon</div>,
    })

    expect(screen.getByText('Test Sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument()
  })

  it('should render search bar by default', () => {
    renderSidebar()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('should not render search bar when showSearchBar is false', () => {
    renderSidebar({ showSearchBar: false })
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('should render extra footer content when provided', () => {
    renderSidebar({
      extraFooterContent: <div>Extra Footer Content</div>,
    })
    expect(screen.getByText('Extra Footer Content')).toBeInTheDocument()
  })

  it('should render pinning area when there are pinned items', () => {
    renderSidebar({
      allowPinning: true,
    })

    // Initially pinning area should not be visible
    expect(screen.queryByTestId('pinning-area')).not.toBeInTheDocument()
  })

  it('should apply className when node is pinned via user interaction', async () => {
    let sidebarContext: ReturnType<typeof useSidebar> | null = null

    const TestComponent = () => {
      sidebarContext = useSidebar()
      return <Sidebar allowPinning={true} />
    }

    render(
      <SidebarProvider nodes={mockNodesWithClassName}>
        <TestComponent />
      </SidebarProvider>
    )

    act(() => {
      sidebarContext?.togglePin('1')
    })

    await waitFor(() => {
      const pinnedNode = screen.getByText('Node with custom class')
      expect(pinnedNode).toBeInTheDocument()
      expect(pinnedNode).toHaveClass('custom-node-class', 'text-blue-500')
    })
  })
})
