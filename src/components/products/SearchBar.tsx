import { Icon } from '../common/Icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="product-search">Cari produk</label>
      <div className="search-bar__control">
        <Icon name="search" size={18} className="search-bar__icon" />
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='Coba "phone" atau "chair"'
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Hapus pencarian"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
