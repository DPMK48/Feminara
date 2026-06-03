import type { CSSProperties } from 'react';
import {
  Apple,
  Baby,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  Droplets,
  Ear,
  Flower2,
  Handshake,
  Heart,
  HelpCircle,
  Home,
  Laptop,
  Leaf,
  Lock,
  MessageCircle,
  Mic,
  Moon,
  PenLine,
  Pill,
  Sparkles,
  Sprout,
  Sun,
  Thermometer,
  Upload,
  User,
  Users,
  Zap,
} from 'lucide-react';

const ICONS = {
  apple: Apple,
  baby: Baby,
  barChart: BarChart3,
  bell: Bell,
  book: BookOpen,
  briefcase: Briefcase,
  chevronDown: ChevronDown,
  droplets: Droplets,
  ear: Ear,
  flower: Flower2,
  handshake: Handshake,
  heart: Heart,
  help: HelpCircle,
  home: Home,
  laptop: Laptop,
  leaf: Leaf,
  lock: Lock,
  message: MessageCircle,
  mic: Mic,
  moon: Moon,
  pen: PenLine,
  pill: Pill,
  sparkles: Sparkles,
  sprout: Sprout,
  sun: Sun,
  thermometer: Thermometer,
  upload: Upload,
  user: User,
  users: Users,
  zap: Zap,
};

export type AppIconName = keyof typeof ICONS;

export default function AppIcon({
  name,
  size = 20,
  className,
  strokeWidth = 2,
  style,
}: {
  name: AppIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}
