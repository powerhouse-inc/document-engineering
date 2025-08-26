import type { IconName } from '../../components/icon/index.js'

export enum NodeStatus {
  CREATED = 'CREATED',
  MODIFIED = 'MODIFIED',
  REMOVED = 'REMOVED',
  MOVED = 'MOVED',
  DUPLICATED = 'DUPLICATED',
  UNCHANGED = 'UNCHANGED', // default
}

export type SidebarIcon = IconName | React.ReactElement

export interface SidebarNode {
  title: string
  id: string
  children?: SidebarNode[]
  icon?: SidebarIcon
  expandedIcon?: SidebarIcon
  status?: NodeStatus
  className?: string
}

export interface FlattenedNode extends SidebarNode {
  depth: number
  isExpanded: boolean
}
export interface NodeIdStyle {
  id: string
  className: string
}
