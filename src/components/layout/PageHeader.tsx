import type { ReactNode } from 'react';

interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ badge, title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__top">
        <div>
          <span className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            {badge}
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
