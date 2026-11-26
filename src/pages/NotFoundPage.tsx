import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';

export function NotFoundPage() {
  return (
    <div className="page page--narrow">
      <EmptyState
        title="Page not found"
        message="The route you requested does not exist in this catalog."
        action={
          <Link className="button button--primary" to="/products">
            Go to catalog
          </Link>
        }
      />
    </div>
  );
}
