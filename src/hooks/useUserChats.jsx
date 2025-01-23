import { useQuery } from "@tanstack/react-query";
import { newRequest } from "@/endpoints";
import { GET_CHAT_LIST } from "@/endpoints/chat";

export const useRefetchUserChats = (userInfo) => {
  const {
    refetch,
    data: userChats,
    isLoading,
  } = useQuery({
    queryKey: ["userChats", userInfo],
    queryFn: () => newRequest.get(GET_CHAT_LIST),
    enabled: !!userInfo?._id,
  });

  return { refetch, userChats, isLoading };
};
