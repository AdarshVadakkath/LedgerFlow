import * as React from "react";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onLogout: () => void;
}
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Attendance",
      path: "/attendance",
      icon: <UsersIcon />,
    },
    {
      title: "Clients",
      path: "/clients",
      icon: <ListIcon />,
    },
    {
      title: "Tasks",
      path: "/tasks",
      icon: <ChartBarIcon />,
    },
    {
      title: "Documents",
      path: "/documents",
      icon: <FolderIcon />,
    },
  ],
};
export function AppSidebar({
  onLogout,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/dashboard")}
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <span className="text-1xl font-bold">LedgerFlow</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={data.navMain}
          onNavigate={(path) => navigate(path)}
          currentPath={location.pathname}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
