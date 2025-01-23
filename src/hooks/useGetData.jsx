import { newRequest } from "@/endpoints";
import { useQuery } from "@tanstack/react-query";

const useGetData = (api, key, enableTerm) => {
  const { data, isLoading } = useQuery({
    queryKey: [key, api],
    queryFn: () =>
      newRequest.get(api).then((res) => {
        return res?.data?.data;
      }),
    enabled: enableTerm,
  });
  return { data, isLoading };
};

export default useGetData;
