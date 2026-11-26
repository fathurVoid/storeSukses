import { useEffect, useId } from 'react';
import { Icon } from './Icon';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Ya, lanjutkan',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    document.body.classList.add('modal-open');

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKey);
    };
  }, [onCancel]);

  return (
    <div className="modal-backdrop animate-fade-in" onMouseDown={onCancel}>
      <div
        className="modal-card glass-card animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-card__body">
          <span className="modal-card__icon">
            <Icon name="alert" size={24} />
          </span>
          <div>
            <h3 id={titleId}>{title}</h3>
            <p id={descriptionId}>{message}</p>
          </div>
        </div>
        <div className="modal-card__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Batal
          </button>
          <button type="button" className="button button--primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
