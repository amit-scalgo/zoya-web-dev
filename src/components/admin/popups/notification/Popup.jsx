import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { AdminNotifcationCard } from "./Card";
import { useNotificationStore } from "@/lib/store/notification.store";

export function AdminNotificationPopup() {
  const { notifications } = useNotificationStore();
  const newNotificationCount = notifications?.filter(
    (i) => i?.status !== "read",
  ).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Bell className="size-5 min-w-5 cursor-pointer text-black/40 hover:text-zoyaprimary" />
          {newNotificationCount > 0 && (
            <span className="absolute -right-1 -top-2 z-[99] flex size-4 items-center justify-center rounded-full bg-zoyaprimary text-[0.52rem] font-semibold leading-none text-white">
              {newNotificationCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-3 mt-3 h-fit w-fit border-0 p-0 shadow-none">
        <AdminNotifcationCard className="w-full" />
      </PopoverContent>
    </Popover>
  );
}
