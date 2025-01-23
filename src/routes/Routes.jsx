import AuthLayout from "@/layouts/app/AuthLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminRoutes } from "./admin/Admin.Routes";
import { AppRoutes } from "./App.Routes";
import { AuthRoutes } from "./Auth.Routes";
import AccountCreated from "@/pages/app/AccountCreated";
import { AppLayout } from "@/layouts/app/Authenticated";
import { AdminLayout } from "@/layouts/admin/Authenticated";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: AppRoutes,
  },
  {
    path: "/account-created",
    element: <AccountCreated />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: AdminRoutes,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: AuthRoutes,
  },
]);

const Routes = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default Routes;
