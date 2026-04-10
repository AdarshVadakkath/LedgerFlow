import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


export function NavMain({
  items,
  onNavigate,
  currentPath,
}: {
  items: {
    title: string;
    path: string;
    icon?: React.ReactNode;
  }[];
  onNavigate?: (path: string) => void;
  currentPath?: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => onNavigate?.(item.path)}
                  className={isActive ? "bg-accent" : ""}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
