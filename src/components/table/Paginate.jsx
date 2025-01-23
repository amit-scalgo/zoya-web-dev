import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Paginate({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

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

  const updatePage = (page) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="flex h-11 w-fit items-center gap-10 rounded-3xl bg-[#F9F9F9] text-zinc-700">
      <div className="flex items-center gap-3 px-4">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="left flex items-center justify-center text-[0.84rem] font-medium"
          style={{
            color: currentPage === 1 ? "#6852D6" : "#00000080",
            pointerEvents: currentPage === 1 ? "none" : "auto",
          }}
        >
          <ChevronLeft className="h-5" />
        </button>
        {pageNumbers.map((page) => (
          <button
            onClick={() => updatePage(page)}
            key={page}
            className="left flex h-7 w-7 items-center justify-center rounded-full text-sm"
            style={{
              backgroundColor: currentPage === page ? "#6852D6" : "",
              color: currentPage === page ? "#fff" : "",
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="right flex items-center justify-center rounded-full text-[0.84rem] font-medium"
          style={{
            color: currentPage === totalPages ? "#6852D6" : "#00000080",
            pointerEvents: currentPage === totalPages ? "none" : "auto",
          }}
        >
          <ChevronRight className="h-5" />
        </button>
      </div>
    </div>
  );
}
