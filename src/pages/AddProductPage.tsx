import { AddProductForm } from '../components/forms/AddProductForm';

export function AddProductPage() {
  return (
    <div className="page page--narrow">
      <section className="page-heading">
        <p className="eyebrow">Local form</p>
        <h1>Add a product</h1>
        <p>
          Fill in the form to create a product on this device. Inputs are validated before it is
          added.
        </p>
      </section>

      <aside className="info-panel">
        <strong>Local only.</strong> This product is saved in localStorage, appears in the Local
        section of the catalog, and can be favorited. It is never submitted to DummyJSON or any
        other server.
      </aside>

      <AddProductForm />
    </div>
  );
}
