import { CallScreen } from "@/components/app/call/CallScreen";
import { SubmitCallRating } from "@/components/popups/common/CallRating";
import { AppSidebar } from "@/components/ui/AppSidebar";
import Header from "@/components/ui/header/Header";
import Loader from "@/components/ui/Loader";
import { newRequest } from "@/endpoints";
import { USER } from "@/endpoints/user";
import { useUserStore } from "@/lib/store/user.store";
import { SocketProvider } from "@/providers/socketProvider";
import StreamProvider from "@/providers/StreamProvider";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

const AppLayo = () => {
  const token = localStorage.getItem("token");
  const { setUserInfo } = useUserStore();

  const fetchUserProfile = async () => {
    const data = await newRequest(USER);
    if (data?.data) {
      setUserInfo(data?.data);
      return data?.data;
    } else {
      throw new Error("Failed to fetch profile");
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ["profile", token],
    queryFn: fetchUserProfile,
    enabled: !!token,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return token && !error ? (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ) : (
    <Navigate to="/auth/login" />
  );
};

const AuthenticatedLayout = ({ children }) => (
  <SocketProvider>
    <StreamProvider>
      <CallScreen />
      {/* <SubmitCallRating /> */}
      {/* <MoodPicker /> */}
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

export default AppLayout;
