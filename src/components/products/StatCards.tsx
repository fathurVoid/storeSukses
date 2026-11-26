import { Icon, type IconName } from '../common/Icon';

interface StatCardsProps {
  total: number;
  categories: number;
  saved: number;
  local: number;
}

export function StatCards({ total, categories, saved, local }: StatCardsProps) {
  const cards: Array<{ label: string; value: number; hint: string; icon: IconName }> = [
    { label: 'Produk API', value: total, hint: 'hasil saat ini', icon: 'box' },
    { label: 'Kategori', value: categories, hint: 'dari DummyJSON', icon: 'layers' },
    { label: 'Tersimpan', value: saved, hint: 'favorit Anda', icon: 'bookmark' },
    { label: 'Produk Lokal', value: local, hint: 'di perangkat ini', icon: 'book' },
  ];

  return (
    <div className="stat-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card glass-card animate-fade-in">
          <span className="stat-card__glow" aria-hidden="true" />
          <div className="stat-card__top">
            <span className="stat-card__label">{card.label}</span>
            <span className="stat-card__icon">
              <Icon name={card.icon} size={20} />
            </span>
          </div>
          <div className="stat-card__value">
            <strong>{card.value}</strong>
            <span>{card.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
