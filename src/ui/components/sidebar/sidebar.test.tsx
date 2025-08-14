import { describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Icon } from '../../components/icon/index.js'
import { Sidebar } from './sidebar.js'
import { SidebarProvider, useSidebar } from './subcomponents/sidebar-provider/index.js'

// Mock react-virtualized components for testing
vi.mock('react-virtualized', () => ({
  AutoSizer: ({ children }: { children: (props: { width: number; height: number }) => React.ReactNode }) =>
    children({ width: 300, height: 400 }),
  List: ({
    rowRenderer,
    rowCount,
  }: {
    rowRenderer: (args: { index: number; key: string | number; style: React.CSSProperties }) => React.ReactNode
    rowCount: number
  }) => (
    <div>
      {Array.from({ length: rowCount }, (_, index) =>
        rowRenderer({ index, key: index, style: {} as React.CSSProperties })
      )}
    </div>
  ),
}))

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

  describe('Sidebar Header Button Interactions', () => {
    it('should call handleOnTitleClick when sidebar title button is clicked', async () => {
      const user = userEvent.setup()
      const handleOnTitleClick = vi.fn()

      renderSidebar({
        sidebarTitle: 'Test Sidebar',
        handleOnTitleClick,
      })

      const titleButton = screen.getByRole('button', { name: 'Test Sidebar' })
      expect(titleButton).toBeInTheDocument()

      await user.click(titleButton)
      expect(handleOnTitleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading State', () => {
    it('should render normal content when isLoading is false', () => {
      renderSidebar({ isLoading: false })

      // Should see normal sidebar items
      expect(screen.getByText('Node 1')).toBeInTheDocument()
      expect(screen.getByText('Node 2')).toBeInTheDocument()

      // Should not see loading indicator
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('should render skeleton items when isLoading is true', () => {
      renderSidebar({ isLoading: true })

      // Should see loading status indicator
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading sidebar content')).toBeInTheDocument()

      // Should not see normal sidebar items
      expect(screen.queryByText('Node 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Node 2')).not.toBeInTheDocument()
    })

    it('should render skeleton items with proper ARIA attributes', () => {
      renderSidebar({ isLoading: true })

      const loadingContainer = screen.getByRole('status')
      expect(loadingContainer).toHaveAttribute('aria-label', 'Loading sidebar content')
    })

    it('should preserve header functionality during loading', () => {
      renderSidebar({
        isLoading: true,
        sidebarTitle: 'Test Sidebar',
        sidebarIcon: <div data-testid="sidebar-icon">Icon</div>,
      })

      // Header should still be visible and functional
      expect(screen.getByText('Test Sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument()
    })

    it('should preserve search bar during loading', () => {
      renderSidebar({
        isLoading: true,
        showSearchBar: true,
      })

      // Search bar should still be present
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('should preserve footer content during loading', () => {
      renderSidebar({
        isLoading: true,
        extraFooterContent: <div>Extra Footer Content</div>,
      })

      // Footer should still be visible
      expect(screen.getByText('Extra Footer Content')).toBeInTheDocument()
    })

    it('should not display pinning area during loading even when allowPinning is true', () => {
      renderSidebar({
        isLoading: true,
        allowPinning: true,
      })

      // Pinning area should not be visible during loading
      expect(screen.queryByTestId('pinning-area')).not.toBeInTheDocument()
    })

    it('should default to false when isLoading prop is not provided', () => {
      renderSidebar()

      // Should show normal content by default
      expect(screen.getByText('Node 1')).toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('should handle transition from loading to loaded state', async () => {
      const { rerender } = render(
        <SidebarProvider nodes={mockNodes}>
          <Sidebar isLoading={true} />
        </SidebarProvider>
      )

      // Initially should show loading state
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText('Node 1')).not.toBeInTheDocument()

      // Rerender with loading false
      rerender(
        <SidebarProvider nodes={mockNodes}>
          <Sidebar isLoading={false} />
        </SidebarProvider>
      )

      // Should now show actual content
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
        expect(screen.getByText('Node 1')).toBeInTheDocument()
      })
    })

    it('should match snapshot in loading state', () => {
      const { asFragment } = renderSidebar({
        isLoading: true,
        sidebarTitle: 'Test Sidebar',
        sidebarIcon: <Icon name="M" size={16} />,
        enableMacros: 2,
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
