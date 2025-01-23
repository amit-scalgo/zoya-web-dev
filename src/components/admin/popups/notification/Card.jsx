import { BellRing, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNotificationStore } from "@/lib/store/notification.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { newRequest } from "@/endpoints";
import {
  MARK_ALL_NOTIFICATIONS_READ,
  UPDATE_NOTIFICATION_STATUS,
} from "@/endpoints/notification";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);

export function AdminNotifcationCard({ className, ...props }) {
  const queryClient = useQueryClient();
  const {
    notifications,
    pauseNotification,
    enableNotification,
    markAllNotificationRead,
  } = useNotificationStore();
  const markNotificationRead = useNotificationStore(
    (state) => state.markNotificationRead,
  );
  const newNotificationCount = notifications?.filter(
    (i) => i?.status !== "read",
  ).length;

  const handleMarkRead = async (notificationId) => {
    try {
      const res = await newRequest.post(UPDATE_NOTIFICATION_STATUS, {
        notificationId,
        status: "read",
      });
      if (res.status === 200) {
        markNotificationRead(notificationId);
        console.log("Notification status updated successfully");
      } else {
        console.error("Failed to update notification status:", res.data.error);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await newRequest.get(MARK_ALL_NOTIFICATIONS_READ);
      if (res.status === 200) {
        markAllNotificationRead();
        queryClient.invalidateQueries(["adminNotifications"]);
        console.log("All notifications marked as read successfully");
        toast.success("All notifications marked as read successfully");
      } else {
        console.error(
          "Failed to mark all notifications as read:",
          res.data.error,
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          You have {newNotificationCount} unread messages.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Pause Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Pause notifications for now.
            </p>
          </div>
          <Switch
            checked={pauseNotification}
            onCheckedChange={(checked) => {
              enableNotification(checked);
            }}
          />
        </div>
        <div className="overflow-y-min h-56 w-96 min-w-96 overflow-y-auto pr-5">
          {notifications?.map((notification, index) => (
            <div
              key={index}
              className="relative mb-4 flex items-center gap-2 pb-2 last:mb-0 last:pb-0"
            >
              {notification?.status !== "read" && (
                <span className="absolute left-8 top-1 z-10 flex size-3 rounded-full bg-sky-500" />
              )}
              <div className="flex flex-col items-center text-xs font-semibold">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={notification?.fromUser?.avatar}
                    alt={notification?.fromUser?.name}
                  />
                  <AvatarFallback className="text-xs font-semibold">
                    {notification?.fromUser?.name?.charAt(0).toUpperCase()}
                    {notification?.fromUser?.name?.charAt(1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/user?request=${notification?.from}&open=true`}
                    className="text-sm font-medium leading-none"
                  >
                    {notification?.text}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {dayjs(notification?.createdAt).fromNow()}
                  </p>
                  <div className="text-[0.67rem] font-bold">
                    {notification?.status === "read" ? (
                      <CheckCheck
                        className="size-4 text-green-500"
                        aria-label="read"
                      />
                    ) : (
                      <div
                        onClick={() => handleMarkRead(notification?._id)}
                        className="flex cursor-pointer rounded bg-zoyaprimary/20 px-1 text-black/70 shadow"
                      >
                        Mark Read
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {newNotificationCount > 0 && (
          <Button onClick={handleMarkAllRead} className="w-full bg-zoyaprimary">
            <Check /> Mark all as read
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
