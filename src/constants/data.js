import {
  Calendar,
  ChartBarIncreasingIcon,
  Contact2Icon,
  Grid2x2Check,
  Inbox,
  LayoutDashboardIcon,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: MessageSquareText,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    url: "/admin/user",
    icon: Users,
  },
  {
    title: "Support Members",
    url: "/admin/support",
    icon: Contact2Icon,
  },
  {
    title: "Logs",
    url: "/admin/records",
    icon: Grid2x2Check,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartBarIncreasingIcon,
  },
];
