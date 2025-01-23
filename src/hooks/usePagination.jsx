import { newRequest } from "@/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const usePagination = ({ endpoint, queryKey, pageSize = 10 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, currentPage, status, keyword],
    queryFn: () =>
      newRequest
        .get(endpoint, {
          params: {
            search: keyword,
            status: status,
            page: currentPage,
            pageSize: pageSize,
          },
        })
        .then((res) => {
          return res.data;
        }),
    enabled: !!endpoint,
  });

  const totalPages = data?.meta?.totalPages || 1;

  return {
    data: data?.data || [],
    totalPages,
    isLoading,
    setKeyword,
    keyword,
    setStatus,
    status,
    currentPage,
  };
};
