import type { SortBy, SortOrder } from '../../types/product';

interface SortControlsProps {
  sortBy: SortBy;
  order: SortOrder;
  onChange: (sortBy: SortBy, order: SortOrder) => void;
}

export function SortControls({ sortBy, order, onChange }: SortControlsProps) {
  return (
    <div className="sort-controls">
      <div className="filter-field">
        <label htmlFor="sort-by">Urutkan</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) => onChange(event.target.value as SortBy, order)}
        >
          <option value="">Unggulan</option>
          <option value="price">Harga</option>
          <option value="title">Nama</option>
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="sort-order">Arah</label>
        <select
          id="sort-order"
          value={order}
          disabled={!sortBy}
          onChange={(event) => onChange(sortBy, event.target.value as SortOrder)}
        >
          <option value="asc">Menaik</option>
          <option value="desc">Menurun</option>
        </select>
      </div>
    </div>
  );
}
