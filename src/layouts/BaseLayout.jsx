import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/lib/store/user.store";
import { newRequest } from "@/endpoints";
import Loader from "@/components/ui/Loader";
import { useEffect } from "react";

export const BaseLayout = ({
  profileEndpoint,
  AuthenticatedLayoutComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { setUserInfo } = useUserStore();

  const fetchUserProfile = async () => {
    const data = await newRequest(profileEndpoint);
    if (data?.data) {
      setUserInfo(data.data);
      return data.data;
    } else {
      throw new Error("Failed to fetch profile");
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["profile", token, profileEndpoint],
    queryFn: fetchUserProfile,
    enabled: !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && data?.role === "admin" && location.pathname === "/") {
      navigate("/admin");
    }
  }, [data, data?.role]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!token || error || !data) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <AuthenticatedLayoutComponent>
      <Outlet />
    </AuthenticatedLayoutComponent>
  );
};
