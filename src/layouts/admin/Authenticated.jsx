import { BaseLayout } from "../BaseLayout";
import { ADMIN_PROFILE } from "@/endpoints/admin";
import { AppSidebar } from "@/components/ui/AppSidebar";
import AdminHeader from "@/components/ui/header/AdminHeader";
import { SocketProvider } from "@/providers/socketProvider";

const AdminAuthenticatedLayout = ({ children }) => (
  <SocketProvider>
    <div className="overflow-y-min flex h-screen w-full overflow-y-auto bg-zoyaprimary/5">
      <AppSidebar type="admin" />
      <div className="mx-auto flex min-h-full w-full flex-grow flex-col px-7 2xl:container">
        <AdminHeader />
        {children}
      </div>
    </div>
  </SocketProvider>
);

export const AdminLayout = () => (
  <BaseLayout
    profileEndpoint={ADMIN_PROFILE}
    AuthenticatedLayoutComponent={AdminAuthenticatedLayout}
  />
);
