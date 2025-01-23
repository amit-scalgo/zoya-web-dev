import Home from "@/pages/app/Home";
import Profile from "@/pages/app/Profile";

export const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];
