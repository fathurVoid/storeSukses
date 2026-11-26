import { Icon } from './Icon';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card state-card--error" role="alert">
      <span className="state-card__icon" aria-hidden="true">
        <Icon name="alert" size={24} />
      </span>
      <h3>Terjadi kesalahan</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button--ghost" onClick={onRetry}>
          <Icon name="refresh" size={16} />
          Coba lagi
        </button>
      )}
    </div>
  );
}
