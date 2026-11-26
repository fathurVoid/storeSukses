import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  icon?: IconName;
}

export function EmptyState({ title, message, action, icon = 'box' }: EmptyStateProps) {
  return (
    <div className="state-card state-card--empty">
      <span className="state-card__icon" aria-hidden="true">
        <Icon name={icon} size={24} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
