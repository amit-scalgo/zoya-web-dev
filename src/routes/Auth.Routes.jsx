import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export const AuthRoutes = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
];
