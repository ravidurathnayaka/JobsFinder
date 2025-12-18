import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const benefits: Benefit[] = [
  { id: "401k", label: "401(k)", icon: Briefcase },
  {
    id: "distributed",
    label: "Distributed team",
    icon: Users,
  },
  { id: "async", label: "Async", icon: Zap },
  {
    id: "vision",
    label: "Vision insurance",
    icon: Eye,
  },
  {
    id: "dental",
    label: "Dental insurance",
    icon: Tooth,
  },
  {
    id: "medical",
    label: "Medical insurance",
    icon: Heart,
  },
  {
    id: "unlimited_vacation",
    label: "Unlimited vacation",
    icon: Umbrella,
  },
  { id: "pto", label: "Paid time off", icon: Clock },
  {
    id: "four_day",
    label: "4 day workweek",
    icon: Calendar,
  },
  {
    id: "401k_matching",
    label: "401k matching",
    icon: Coins,
  },
  {
    id: "company_retreats",
    label: "Company retreats",
    icon: Building,
  },
  {
    id: "coworking_budget",
    label: "Coworking budget",
    icon: Building,
  },
  {
    id: "learning_budget",
    label: "Learning budget",
    icon: GraduationCap,
  },
  {
    id: "gym",
    label: "Free gym membership",
    icon: Dumbbell,
  },
  {
    id: "mental_wellness",
    label: "Mental wellness budget",
    icon: Brain,
  },
  {
    id: "home_office",
    label: "Home office budget",
    icon: Home,
  },
  {
    id: "crypto",
    label: "Pay in crypto",
    icon: Bitcoin,
  },
  {
    id: "pseudonymous",
    label: "Pseudonymous",
    icon: UserCircle,
  },
  {
    id: "profit_sharing",
    label: "Profit sharing",
    icon: PieChart,
  },
  {
    id: "equity",
    label: "Equity compensation",
    icon: Coins,
  },
  {
    id: "no_whiteboard",
    label: "No whiteboard interview",
    icon: MonitorOff,
  },
  {
    id: "no_monitoring",
    label: "No monitoring system",
    icon: Shield,
  },
  {
    id: "hire_old_young",
    label: "We hire old (and young)",
    icon: UserPlus,
  },
];
