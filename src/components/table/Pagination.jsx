import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  setTotalPages,
  totalPages,
  setCurrentPage,
  currentPage,
  depkey,
  margin,
}) {
  useEffect(() => {
    setTotalPages(depkey?.totalPages);
  }, [depkey]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const generatePageNumbers = () => {
    const visiblePageCount = 7;
    const halfVisiblePages = Math.floor(visiblePageCount / 2);
    const startPage = Math.max(1, currentPage - halfVisiblePages);
    const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const pageNumbers = generatePageNumbers();

  return (
    <div
      className={`${margin && "mt-10"} flex h-12 w-fit items-center gap-10 rounded-3xl bg-[#F9F9F9] text-zinc-700`}
    >
      <div className="flex items-center gap-3 px-5">
        <button
          style={{
            color: currentPage === 1 ? "#6974FD" : "#00000080",
          }}
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
          className="left flex items-center justify-center text-[0.84rem] font-medium"
        >
          <ChevronLeft className="h-5" />
        </button>
        {pageNumbers?.map((page) => (
          <button
            style={{
              backgroundColor: currentPage === page ? "#6974FD" : "",
              color: currentPage === page ? "#fff" : "",
            }}
            className="left flex h-7 w-7 items-center justify-center rounded-full text-sm"
            key={page}
            onClick={() => setCurrentPage(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ))}
        <button
          style={{
            color: currentPage === totalPages ? "#6974FD" : "#00000080",
          }}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="right flex items-center justify-center rounded-full text-[0.84rem] font-medium"
        >
          <ChevronRight className="h-5" />
        </button>
      </div>
    </div>
  );
}
