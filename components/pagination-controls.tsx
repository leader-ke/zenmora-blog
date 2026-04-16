import Link from "next/link";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function getPageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Link
        href={getPageHref(basePath, Math.max(1, currentPage - 1))}
        className={`pagination__link ${currentPage === 1 ? "pagination__link--disabled" : ""}`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        Previous
      </Link>
      <div className="pagination__pages">
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={getPageHref(basePath, pageNumber)}
            className={`pagination__link ${pageNumber === currentPage ? "pagination__link--active" : ""}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        ))}
      </div>
      <Link
        href={getPageHref(basePath, Math.min(totalPages, currentPage + 1))}
        className={`pagination__link ${currentPage === totalPages ? "pagination__link--disabled" : ""}`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next
      </Link>
    </nav>
  );
}
