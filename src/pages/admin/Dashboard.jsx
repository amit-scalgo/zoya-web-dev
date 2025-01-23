import { UserCountStat } from "@/components/admin/stats/UserCountStat";
import { UserStatsCard } from "@/components/admin/stats/UserStat";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { newRequest } from "@/endpoints";
import {
  ADMIN_DASHBOARD_COUNT,
  ADMIN_DASHBOARD_GRAPH,
} from "@/endpoints/admin";
import { useQuery } from "@tanstack/react-query";
import {
  GitPullRequest,
  MessageSquareQuote,
  PhoneCall,
  User,
  Users2,
} from "lucide-react";
import React from "react";

export default function AdminDashboard() {
  const { data: adminDashboardCount, isLoading: isAdminDashboardCountLoading } =
    useQuery({
      queryKey: ["adminDashboardCount"],
      queryFn: () =>
        newRequest.get(ADMIN_DASHBOARD_COUNT).then((res) => {
          return res?.data?.data;
        }),
    });

  const { data: adminDashboardGraph, isLoading: isAdminDashboardGraphLoading } =
    useQuery({
      queryKey: ["adminDashboardGraph"],
      queryFn: () =>
        newRequest.get(ADMIN_DASHBOARD_GRAPH).then((res) => {
          return res?.data?.data;
        }),
    });

  if (isAdminDashboardCountLoading || isAdminDashboardGraphLoading) {
    return <Loader />;
  }

  return (
    <>
      <h5 className="my-5 flex font-bold">
        Welcome, Admin!
        <span className="text-zoyaprimary/90">👋</span>
      </h5>
      <div className="grid grid-cols-5 gap-3">
        <Card className="flex items-center justify-between gap-1 p-5 shadow-sm">
          <div className="flex rounded-full bg-zoyaprimary/90 p-3 text-white">
            <User />
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
            <div className="text-xl font-extrabold text-black/90">
              {adminDashboardCount?.totalUsers}
            </div>
            <h5 className="text-sm font-semibold text-black/50">Customers</h5>
          </div>
        </Card>
        <Card className="flex items-center justify-between gap-1 p-5 shadow-sm">
          <div className="flex rounded-full bg-orange-400 p-3 text-white">
            <Users2 />
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
            <div className="text-xl font-extrabold text-black/90">
              {adminDashboardCount?.supportMembers}
            </div>
            <h5 className="text-sm font-semibold text-black/50">
              Support Members
            </h5>
          </div>
        </Card>
        <Card className="flex items-center justify-between gap-1 p-5 shadow-sm">
          <div className="flex rounded-full bg-green-500 p-3 text-white">
            <PhoneCall />
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
            <div className="text-xl font-extrabold text-black/90">
              {adminDashboardCount?.totalCalls}
            </div>
            <h5 className="text-sm font-semibold text-black/50">Total Calls</h5>
          </div>
        </Card>
        <Card className="flex items-center justify-between gap-1 p-5 shadow-sm">
          <div className="flex rounded-full bg-blue-500 p-3 text-white">
            <MessageSquareQuote />
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
            <div className="text-xl font-extrabold text-black/90">
              {adminDashboardCount?.totalChats}
            </div>
            <h5 className="text-sm font-semibold text-black/50">Total Chats</h5>
          </div>
        </Card>
        <Card className="flex items-center justify-between gap-1 p-5 shadow-sm">
          <div className="flex rounded-full bg-gray-400 p-3 text-white">
            <GitPullRequest />
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
            <div className="text-xl font-extrabold text-black/90">
              {adminDashboardCount?.totalRequests}
            </div>
            <h5 className="text-sm font-semibold text-black/50">Requests</h5>
          </div>
        </Card>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-3">
        <UserStatsCard data={adminDashboardGraph?.newUsersPerMonth} />
        <UserCountStat data={adminDashboardGraph?.userTypes} />
      </div>
    </>
  );
}
