import AdminDashboard from "@/pages/admin/Dashboard";
import RecordListing from "@/pages/admin/records/Index";
import SupportListing from "@/pages/admin/support/Index";
import UserListing from "@/pages/admin/user/Index";

export const AdminRoutes = [
  {
    index: true,
    element: <AdminDashboard />,
  },
  {
    path: "support",
    element: <SupportListing />,
  },
  {
    path: "user",
    element: <UserListing />,
  },
  {
    path: "records",
    element: <RecordListing />,
  },
];
