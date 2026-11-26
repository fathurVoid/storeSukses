import type { Category } from '../../types/product';

interface CategoryFilterProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CategoryFilter({ categories, value, onChange, disabled }: CategoryFilterProps) {
  return (
    <div className="filter-field">
      <label htmlFor="category-filter">Kategori</label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Semua kategori</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
