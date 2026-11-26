import { formatRating } from '../../utils/format';
import { Icon } from './Icon';

export function RatingBadge({ rating }: { rating?: number }) {
  return (
    <span className="rating-badge" aria-label={`Rating ${formatRating(rating)} dari 5`}>
      <Icon name="star" size={14} className="rating-badge__icon" />
      <span>{formatRating(rating)}</span>
    </span>
  );
}
