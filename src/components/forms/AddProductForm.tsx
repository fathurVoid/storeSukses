import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useCategories } from '../../hooks/useCategories';
import { useLocalProducts } from '../../hooks/useLocalProducts';
import type { ProductFormErrors, ProductFormValues } from '../../types/product';
import { validateProductForm } from '../../utils/validation';
import { Icon } from '../common/Icon';
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
  const { notify } = useToast();

  function update(field: keyof ProductFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccess(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      notify('Periksa kembali kolom yang ditandai.', 'error');
      return;
    }

    const product = addProduct({
      title: values.title,
      description: values.description,
      price: Number(values.price),
      category: values.category,
      imageUrl: values.imageUrl,
      brand: values.brand,
      stock: values.stock ? Number(values.stock) : undefined,
    });

    setSuccess(`“${product.title}” ditambahkan ke produk lokal Anda.`);
    notify(`“${product.title}” berhasil disimpan di perangkat ini.`, 'success');
    setValues(EMPTY_VALUES);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="form-success" role="status">
          <div>
            <strong>Berhasil!</strong> {success}
          </div>
          <div className="form-success__actions">
            <Link to="/products">Lihat produk lokal</Link>
            <button type="button" className="link-button" onClick={() => setSuccess(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="form-grid">
        <FormField label="Nama produk" htmlFor="title" error={errors.title}>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="Contoh: Kursi Kerja Ergonomis"
            aria-invalid={Boolean(errors.title)}
          />
        </FormField>

        <FormField label="Harga (USD)" htmlFor="price" error={errors.price}>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => update('price', event.target.value)}
            placeholder="Contoh: 149.99"
            aria-invalid={Boolean(errors.price)}
          />
        </FormField>

        <FormField
          label="Kategori"
          htmlFor="category"
          error={errors.category}
          hint="Pilih kategori yang tersedia atau ketik sendiri."
        >
          <input
            id="category"
            type="text"
            list="known-categories"
            value={values.category}
            onChange={(event) => update('category', event.target.value)}
            placeholder="Contoh: furniture"
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

        <FormField label="Merek (opsional)" htmlFor="brand" error={errors.brand}>
          <input
            id="brand"
            type="text"
            value={values.brand}
            onChange={(event) => update('brand', event.target.value)}
            placeholder="Contoh: Northline"
            aria-invalid={Boolean(errors.brand)}
          />
        </FormField>

        <FormField label="Stok (opsional)" htmlFor="stock" error={errors.stock}>
          <input
            id="stock"
            type="text"
            inputMode="numeric"
            value={values.stock}
            onChange={(event) => update('stock', event.target.value)}
            placeholder="Contoh: 12"
            aria-invalid={Boolean(errors.stock)}
          />
        </FormField>

        <FormField
          label="URL Gambar (opsional)"
          htmlFor="imageUrl"
          error={errors.imageUrl}
          hint="Kosongkan untuk menampilkan inisial produk."
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
            label="Deskripsi"
            htmlFor="description"
            error={errors.description}
            hint="Antara 10 sampai 500 karakter."
          >
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Jelaskan produk dalam satu atau dua kalimat."
              aria-invalid={Boolean(errors.description)}
            />
          </FormField>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="button button--primary">
          <Icon name="plus" size={16} />
          Tambah produk lokal
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
          <Icon name="close" size={16} />
          Kosongkan form
        </button>
      </div>
    </form>
  );
}
