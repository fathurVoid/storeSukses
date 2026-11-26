import { Icon } from '../common/Icon';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number): number[] {
  const maxVisible = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - maxVisible + 1));
  const end = Math.min(totalPages, start + maxVisible - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <nav className="pagination" aria-label="Navigasi halaman">
      <p className="pagination__summary">
        Menampilkan <strong>{firstItem}</strong>–<strong>{lastItem}</strong> dari{' '}
        <strong>{total}</strong>
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <Icon name="chevron-left" size={15} />
          Sebelumnya
        </button>
        {getVisiblePages(page, totalPages).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`pagination__page${pageNumber === page ? ' is-current' : ''}`}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
            aria-label={`Halaman ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Berikutnya
          <Icon name="chevron-right" size={15} />
        </button>
      </div>
    </nav>
  );
}
