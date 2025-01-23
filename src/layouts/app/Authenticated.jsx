import { AppSidebar } from "@/components/ui/AppSidebar";
import { CallScreen } from "@/components/app/call/CallScreen";
import { BaseLayout } from "../BaseLayout";
import { USER } from "@/endpoints/user";
import Header from "@/components/ui/header/Header";
import { SocketProvider } from "@/providers/socketProvider";
import StreamProvider from "@/providers/StreamProvider";

const AppAuthenticatedLayout = ({ children }) => (
  <SocketProvider>
    <StreamProvider>
      <CallScreen />
      <div className="flex flex-col">
        <Header />
        <div className="flex w-full">
          <AppSidebar />
          <div className="flex min-h-full w-full flex-grow flex-col">
            {children}
          </div>
        </div>
      </div>
    </StreamProvider>
  </SocketProvider>
);

export const AppLayout = () => (
  <BaseLayout
    profileEndpoint={USER}
    AuthenticatedLayoutComponent={AppAuthenticatedLayout}
  />
);
