import { formatRating } from '../../utils/format';

export function RatingBadge({ rating }: { rating?: number }) {
  return (
    <span className="rating-badge" aria-label={`Rating ${formatRating(rating)} out of 5`}>
      <span aria-hidden="true">★</span> {formatRating(rating)}
    </span>
  );
}
