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
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) => onChange(event.target.value as SortBy, order)}
        >
          <option value="">Featured</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="sort-order">Order</label>
        <select
          id="sort-order"
          value={order}
          disabled={!sortBy}
          onChange={(event) => onChange(sortBy, event.target.value as SortOrder)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
