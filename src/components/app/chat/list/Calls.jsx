import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { newRequest } from "@/endpoints";
import { GET_CALLS } from "@/endpoints/user";
import { useMakeCall } from "@/lib/store/socket.store";
import { useUserStore } from "@/lib/store/user.store";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { MoveDownLeft, MoveUpRight, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserCallList() {
  const [keyword, setKeyword] = useState("");
  const { userInfo } = useUserStore();
  const makeCall = useMakeCall();
  const { data: callLists, isLoading } = useQuery({
    queryKey: ["callLists", userInfo],
    queryFn: () => newRequest(GET_CALLS),
    enabled: !!userInfo?._id,
  });

  const filteredCallLists = callLists?.data?.data?.filter((call) =>
    call?.participants?.[0]?.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const [ongoingCall, setOngoingCall] = useState(() => {
    const savedCall = localStorage.getItem("ongoingCall");
    return savedCall ? JSON.parse(savedCall) : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "ongoingCall") {
        setOngoingCall(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleMakeCall = (currentChatUser) => {
    if (ongoingCall) {
      toast.error(
        "You are already in a call. Please end the current call before starting a new one.",
      );
      return;
    }
    makeCall({
      currentChatUser,
      userInfo,
    });
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="text-black/29 flex h-16 items-center gap-3 px-4 text-sm">
          <Search className="size-4 text-black/20" />
          <input
            className="h-full outline-none"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search in calls .."
          />
        </div>
        <hr className="mx-2 border-black/5" />
        <div className="overflow-y-min flex max-h-[calc(100vh-140px)] flex-col gap-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col space-y-3 px-1 py-2">
              <Skeleton className="h-14 w-full rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : (
            <>
              {filteredCallLists?.map((user) => (
                <div
                  key={user?._id}
                  className="flex h-14 min-h-14 cursor-pointer items-center justify-between border-b border-b-black/5 px-4 text-sm"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user?.participants?.[0]?.avatar}
                          alt={user?.participants?.[0]?.name}
                        />
                        <AvatarFallback className="bg-zoyaprimary text-xs font-semibold text-white">
                          {user?.participants?.[0]?.name
                            ?.charAt(0)
                            .toUpperCase() ?? "D"}
                          {user?.participants?.[0]?.name
                            ?.charAt(1)
                            .toUpperCase() ?? "E"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-0.5">
                          <>
                            {user?.callFrom === userInfo?._id ? (
                              <MoveUpRight
                                className={`size-4 ${user.callStatus === "Missed" ? "text-red-500" : "text-green-500"}`}
                              />
                            ) : (
                              <MoveDownLeft
                                className={`size-4 ${user.callStatus === "Missed" ? "text-red-500" : "text-green-500"}`}
                              />
                            )}
                          </>
                          <span className="line-clamp-1 text-[0.8rem] font-semibold capitalize">
                            {user?.participants?.[0]?.name ?? "Deleted User"}
                          </span>
                        </div>
                        <span className="-mt-[3px] ml-1.5 text-[0.67rem]">
                          {user?.createdAt && dayjs(user.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    {user?.chatStatus !== "closed" && (
                      <Phone
                        onClick={() => {
                          handleMakeCall({
                            _id: user?.participants?.[0]?._id,
                            name: user?.participants?.[0]?.name,
                            avatar: user?.participants?.[0]?.avatar,
                            chat_id: user?.participants?.[0]?.chat?._id,
                          });
                        }}
                        className="size-5 text-black/40"
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
