import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useLocalProducts } from '../../hooks/useLocalProducts';
import type { ProductFormErrors, ProductFormValues } from '../../types/product';
import { validateProductForm } from '../../utils/validation';
import { FormField } from './FormField';

const EMPTY_VALUES: ProductFormValues = {
  title: '',
  price: '',
  category: '',
  description: '',
  imageUrl: '',
  brand: '',
  stock: '',
};

export function AddProductForm() {
  const [values, setValues] = useState<ProductFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const { categories } = useCategories();
  const { addProduct } = useLocalProducts();

  function update(field: keyof ProductFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccess(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const product = addProduct({
      title: values.title,
      description: values.description,
      price: Number(values.price),
      category: values.category,
      imageUrl: values.imageUrl,
      brand: values.brand,
      stock: values.stock ? Number(values.stock) : undefined,
    });

    setSuccess(`“${product.title}” was added to your local products.`);
    setValues(EMPTY_VALUES);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="form-success" role="status">
          <div>
            <strong>Success!</strong> {success}
          </div>
          <div className="form-success__actions">
            <Link to="/products">View local products</Link>
            <button type="button" className="link-button" onClick={() => setSuccess(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="form-grid">
        <FormField label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="e.g. Ergonomic Desk Chair"
            aria-invalid={Boolean(errors.title)}
          />
        </FormField>

        <FormField label="Price (USD)" htmlFor="price" error={errors.price}>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => update('price', event.target.value)}
            placeholder="e.g. 149.99"
            aria-invalid={Boolean(errors.price)}
          />
        </FormField>

        <FormField
          label="Category"
          htmlFor="category"
          error={errors.category}
          hint="Pick a known category or type your own."
        >
          <input
            id="category"
            type="text"
            list="known-categories"
            value={values.category}
            onChange={(event) => update('category', event.target.value)}
            placeholder="e.g. furniture"
            aria-invalid={Boolean(errors.category)}
          />
          <datalist id="known-categories">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </datalist>
        </FormField>

        <FormField label="Brand (optional)" htmlFor="brand" error={errors.brand}>
          <input
            id="brand"
            type="text"
            value={values.brand}
            onChange={(event) => update('brand', event.target.value)}
            placeholder="e.g. Northline"
            aria-invalid={Boolean(errors.brand)}
          />
        </FormField>

        <FormField label="Stock (optional)" htmlFor="stock" error={errors.stock}>
          <input
            id="stock"
            type="text"
            inputMode="numeric"
            value={values.stock}
            onChange={(event) => update('stock', event.target.value)}
            placeholder="e.g. 12"
            aria-invalid={Boolean(errors.stock)}
          />
        </FormField>

        <FormField
          label="Image URL (optional)"
          htmlFor="imageUrl"
          error={errors.imageUrl}
          hint="Leave blank to show an initials placeholder."
        >
          <input
            id="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={(event) => update('imageUrl', event.target.value)}
            placeholder="https://…"
            aria-invalid={Boolean(errors.imageUrl)}
          />
        </FormField>

        <div className="form-field form-field--full">
          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint="Between 10 and 500 characters."
          >
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Describe the product in a sentence or two."
              aria-invalid={Boolean(errors.description)}
            />
          </FormField>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="button button--primary">
          Add local product
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setValues(EMPTY_VALUES);
            setErrors({});
            setSuccess(null);
          }}
        >
          Reset form
        </button>
      </div>
    </form>
  );
}
