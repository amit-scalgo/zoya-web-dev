import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { adminMenuItems, menuItems } from "@/constants/data";

export function AppSidebar({ type }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeType = searchParams.get("type");

  let sidebarLinks =
    type === "admin" || routeType === "admin" ? adminMenuItems : menuItems;
  // chat count
  return (
    <SidebarProvider className="hidden w-16 max-w-16 items-center overflow-hidden md:flex">
      <Sidebar className="-ml-0.5 flex w-16">
        <SidebarContent>
          <SidebarGroup className="items-center">
            <Link
              to={type === "admin" || routeType === "admin" ? "/admin" : "/"}
              className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-sm font-extrabold text-white shadow-md"
            >
              Zoya
            </Link>
            <SidebarGroupContent>
              <SidebarMenu className="mt-7 items-center gap-4">
                {sidebarLinks?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      asChild
                    >
                      <Link
                        className={`${
                          item?.url == location?.pathname
                            ? "flex !h-11 !w-12 items-center justify-center bg-zoyaprimary text-white"
                            : "text-black/50"
                        }`}
                        to={item?.url}
                      >
                        <item.icon className="!size-5" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {type !== "admin" && <ProfileDropdown />}
      </Sidebar>
    </SidebarProvider>
  );
}
