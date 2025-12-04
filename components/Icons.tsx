import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MagicWand01Icon,
  Upload01Icon,
  Image01Icon,
  PlayIcon as PlayIconHuge,
  Download01Icon,
  Cancel01Icon,
  Film01Icon,
  Loading01Icon,
  Key01Icon,
  Shield01Icon,
  Logout01Icon,
  Refresh01Icon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  Maximize01Icon,
  Alert01Icon,
  TransactionHistoryIcon,
  ArrowUpRight01Icon,
  Settings01Icon,
  PlusSignIcon,
  ArrowDown01Icon,
  Layers01Icon,
  InformationCircleIcon,
  Menu01Icon,
  Camera01Icon,
  CameraVideoIcon,
  ZoomIn01Icon,
  ZoomOut01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon as ArrowDown01IconHuge,
  CraneIcon,
  ThreeDViewIcon,
  Angle01Icon,
  ViewIcon,
  Maximize01Icon as Maximize01IconHuge,
  Minimize01Icon,
} from '@hugeicons/core-free-icons';

// Wrapper component to maintain consistent API with customizable size
const IconWrapper = ({
  icon,
  className,
  size = 24
}: {
  icon: any;
  className?: string;
  size?: number;
}) => (
  <HugeiconsIcon
    icon={icon}
    size={size}
    color="currentColor"
    strokeWidth={1.5}
    className={className}
  />
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={MagicWand01Icon} className={className} />
);

export const UploadIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Upload01Icon} className={className} />
);

export const ImageIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Image01Icon} className={className} />
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={PlayIconHuge} className={className} />
);

export const DownloadIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Download01Icon} className={className} />
);

export const XIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Cancel01Icon} className={className} />
);

export const FilmIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Film01Icon} className={className} />
);

export const LoaderIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Loading01Icon} className={className} />
);

export const KeyIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Key01Icon} className={className} />
);

export const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Shield01Icon} className={className} />
);

export const LogOutIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Logout01Icon} className={className} />
);

export const RefreshCcwIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Refresh01Icon} className={className} />
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={CheckmarkCircle01Icon} className={className} />
);

export const TrashIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Delete01Icon} className={className} />
);

export const MaximizeIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Maximize01Icon} className={className} />
);

export const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Alert01Icon} className={className} />
);

export const HistoryIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={TransactionHistoryIcon} className={className} />
);

export const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={ArrowUpRight01Icon} className={className} />
);

export const WandIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={MagicWand01Icon} className={className} />
);

export const SettingsIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Settings01Icon} className={className} />
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={PlusSignIcon} className={className} />
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={ArrowDown01Icon} className={className} />
);

export const LayersIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Layers01Icon} className={className} />
);

export const InfoIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={InformationCircleIcon} className={className} />
);

export const MenuIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={Menu01Icon} className={className} />
);

export const MoveUpIcon = ({ className }: { className?: string }) => (
  <IconWrapper icon={ArrowUp01Icon} className={className} />
);
