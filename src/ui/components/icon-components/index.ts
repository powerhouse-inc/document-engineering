import type { Props } from './types.js'

import ArrowCouterclockwise from './ArrowCouterclockwise.js'
import ArrowDownUp from './ArrowDownUp.js'
import ArrowFilledRight from './ArrowFilledRight.js'
import ArrowLeft from './ArrowLeft.js'
import ArrowUp from './ArrowUp.js'
import BarChart from './BarChart.js'
import BaseArrowLeft from './BaseArrowLeft.js'
import BaseArrowRight from './BaseArrowRight.js'
import Braces from './Braces.js'
import Branch from './Branch.js'
import BrickGlobe from './BrickGlobe.js'
import Briefcase from './Briefcase.js'
import Calendar from './Calendar.js'
import CalendarTime from './CalendarTime.js'
import Caret from './Caret.js'
import CaretDown from './CaretDown.js'
import CaretLeft from './CaretLeft.js'
import CaretRight from './CaretRight.js'
import CaretSort from './CaretSort.js'
import Check from './Check.js'
import CheckCircle from './CheckCircle.js'
import CheckCircleFill from './CheckCircleFill.js'
import Checkmark from './Checkmark.js'
import ChevronDown from './ChevronDown.js'
import Circle from './Circle.js'
import CircleInfo from './CircleInfo.js'
import Clock from './Clock.js'
import ClockFill from './ClockFill.js'
import ClockHistory from './ClockHistory.js'
import CloudSlash from './CloudSlash.js'
import Collapse from './Collapse.js'
import Compass from './Compass.js'
import Connect from './Connect.js'
import ConnectSmall from './ConnectSmall.js'
import Copy from './Copy.js'
import Created from './Created.js'
import CrossCircle from './CrossCircle.js'
import Danger from './Danger.js'
import DescendenceModified from './DescendenceModified.js'
import Disconnect from './Disconnect.js'
import Discord from './Discord.js'
import DownloadFile from './DownloadFile.js'
import Drive from './Drive.js'
import Duplicated from './Duplicated.js'
import Edit from './Edit.js'
import Ellipsis from './Ellipsis.js'
import Error from './Error.js'
import Ethscan from './Ethscan.js'
import Exclamation from './Exclamation.js'
import ExportCsv from './ExportCsv.js'
import ExportJson from './ExportJson.js'
import ExportPdf from './ExportPdf.js'
import ExportUbl from './ExportUbl.js'
import ExportZip from './ExportZip.js'
import File from './File.js'
import FilesEarmark from './FilesEarmark.js'
import FolderClose from './FolderClose.js'
import FolderOpen from './FolderOpen.js'
import FolderPlus from './FolderPlus.js'
import Forum from './Forum.js'
import Gear from './Gear.js'
import Github from './Github.js'
import Globe from './Globe.js'
import GlobeWww from './GlobeWww.js'
import Hdd from './Hdd.js'
import Hide from './Hide.js'
import History from './History.js'
import InfoSquare from './InfoSquare.js'
import Link from './Link.js'
import Linkedin from './Linkedin.js'
import Lock from './Lock.js'
import M from './M.js'
import Modified from './Modified.js'
import Moved from './Moved.js'
import Npm from './Npm.js'
import PackageManager from './PackageManager.js'
import Pencil from './Pencil.js'
import People from './People.js'
import PeopleFill from './PeopleFill.js'
import Person from './Person.js'
import Pin from './Pin.js'
import PinFilled from './PinFilled.js'
import Plus from './Plus.js'
import PlusCircle from './PlusCircle.js'
import PlusSquare from './PlusSquare.js'
import PowerhouseLogoSmall from './PowerhouseLogoSmall.js'
import Project from './Project.js'
import QuestionSquare from './QuestionSquare.js'
import RedoArrow from './RedoArrow.js'
import Reload from './Reload.js'
import Removed from './Removed.js'
import Renown from './Renown.js'
import RenownHover from './RenownHover.js'
import RenownLight from './RenownLight.js'
import Ring from './Ring.js'
import Save from './Save.js'
import Search from './Search.js'
import Server from './Server.js'
import Settings from './Settings.js'
import Show from './Show.js'
import Synced from './Synced.js'
import Syncing from './Syncing.js'
import Tabler from './Tabler.js'
import Timeline from './Timeline.js'
import TimelineCaret from './TimelineCaret.js'
import Trash from './Trash.js'
import TrashFill from './TrashFill.js'
import TreeViewSlash from './TreeViewSlash.js'
import TriangleDown from './TriangleDown.js'
import Tube from './Tube.js'
import VariantArrowLeft from './VariantArrowLeft.js'
import VerticalDots from './VerticalDots.js'
import WarningFill from './WarningFill.js'
import XTwitter from './XTwitter.js'
import Xmark from './Xmark.js'
import XmarkLight from './XmarkLight.js'
import Youtube from './Youtube.js'

export const iconNames = [
  'ArrowCouterclockwise',
  'ArrowDownUp',
  'ArrowFilledRight',
  'ArrowLeft',
  'ArrowUp',
  'BarChart',
  'BaseArrowLeft',
  'BaseArrowRight',
  'Braces',
  'Branch',
  'BrickGlobe',
  'Briefcase',
  'Calendar',
  'CalendarTime',
  'Caret',
  'CaretDown',
  'CaretLeft',
  'CaretRight',
  'CaretSort',
  'Check',
  'CheckCircle',
  'CheckCircleFill',
  'Checkmark',
  'ChevronDown',
  'Circle',
  'CircleInfo',
  'Clock',
  'ClockFill',
  'ClockHistory',
  'CloudSlash',
  'Collapse',
  'Compass',
  'Connect',
  'ConnectSmall',
  'Copy',
  'Created',
  'CrossCircle',
  'Danger',
  'DescendenceModified',
  'Disconnect',
  'Discord',
  'DownloadFile',
  'Drive',
  'Duplicated',
  'Edit',
  'Ellipsis',
  'Error',
  'Ethscan',
  'Exclamation',
  'ExportCsv',
  'ExportJson',
  'ExportPdf',
  'ExportUbl',
  'ExportZip',
  'File',
  'FilesEarmark',
  'FolderClose',
  'FolderOpen',
  'FolderPlus',
  'Forum',
  'Gear',
  'Github',
  'Globe',
  'GlobeWww',
  'Hdd',
  'Hide',
  'History',
  'InfoSquare',
  'Link',
  'Linkedin',
  'Lock',
  'M',
  'Modified',
  'Moved',
  'Npm',
  'PackageManager',
  'Pencil',
  'People',
  'PeopleFill',
  'Person',
  'Pin',
  'PinFilled',
  'Plus',
  'PlusCircle',
  'PlusSquare',
  'PowerhouseLogoSmall',
  'Project',
  'QuestionSquare',
  'RedoArrow',
  'Reload',
  'Removed',
  'Renown',
  'RenownHover',
  'RenownLight',
  'Ring',
  'Save',
  'Search',
  'Server',
  'Settings',
  'Show',
  'Synced',
  'Syncing',
  'Tabler',
  'Timeline',
  'TimelineCaret',
  'Trash',
  'TrashFill',
  'TreeViewSlash',
  'TriangleDown',
  'Tube',
  'VariantArrowLeft',
  'VerticalDots',
  'WarningFill',
  'XTwitter',
  'Xmark',
  'XmarkLight',
  'Youtube',
] as const

export type IconName = (typeof iconNames)[number]
export const iconComponents: Record<IconName, (props: Props) => React.JSX.Element> = {
  ArrowCouterclockwise,
  ArrowDownUp,
  ArrowFilledRight,
  ArrowLeft,
  ArrowUp,
  BarChart,
  BaseArrowLeft,
  BaseArrowRight,
  Braces,
  Branch,
  BrickGlobe,
  Briefcase,
  Calendar,
  CalendarTime,
  Caret,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretSort,
  Check,
  CheckCircle,
  CheckCircleFill,
  Checkmark,
  ChevronDown,
  Circle,
  CircleInfo,
  Clock,
  ClockFill,
  ClockHistory,
  CloudSlash,
  Collapse,
  Compass,
  Connect,
  ConnectSmall,
  Copy,
  Created,
  CrossCircle,
  Danger,
  DescendenceModified,
  Disconnect,
  Discord,
  DownloadFile,
  Drive,
  Duplicated,
  Edit,
  Ellipsis,
  Error,
  Ethscan,
  Exclamation,
  ExportCsv,
  ExportJson,
  ExportPdf,
  ExportUbl,
  ExportZip,
  File,
  FilesEarmark,
  FolderClose,
  FolderOpen,
  FolderPlus,
  Forum,
  Gear,
  Github,
  Globe,
  GlobeWww,
  Hdd,
  Hide,
  History,
  InfoSquare,
  Link,
  Linkedin,
  Lock,
  M,
  Modified,
  Moved,
  Npm,
  PackageManager,
  Pencil,
  People,
  PeopleFill,
  Person,
  Pin,
  PinFilled,
  Plus,
  PlusCircle,
  PlusSquare,
  PowerhouseLogoSmall,
  Project,
  QuestionSquare,
  RedoArrow,
  Reload,
  Removed,
  Renown,
  RenownHover,
  RenownLight,
  Ring,
  Save,
  Search,
  Server,
  Settings,
  Show,
  Synced,
  Syncing,
  Tabler,
  Timeline,
  TimelineCaret,
  Trash,
  TrashFill,
  TreeViewSlash,
  TriangleDown,
  Tube,
  VariantArrowLeft,
  VerticalDots,
  WarningFill,
  XTwitter,
  Xmark,
  XmarkLight,
  Youtube,
} as const
