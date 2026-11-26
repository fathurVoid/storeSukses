export type ProductSource = 'api' | 'local';

/** Normalized product used by every layer of the app. */
export interface Product {
  /** String so external IDs ("1") and local IDs ("local-...") share one type. */
  id: string;
  source: ProductSource;
  title: string;
  description: string;
  price: number;
  category: string;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  brand?: string;
  stock?: number;
  availabilityStatus?: string;
  discountPercentage?: number;
  sku?: string;
  createdAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type SortBy = '' | 'price' | 'title';
export type SortOrder = 'asc' | 'desc';

/** Values mirrored in the URL by useSearchParams. */
export interface ProductQuery {
  q: string;
  category: string;
  sortBy: SortBy;
  order: SortOrder;
  page: number;
  limit: number;
}

export interface NewProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  brand?: string;
  stock?: number;
}

/** Controlled-form values are kept as strings so inputs stay editable. */
export interface ProductFormValues {
  title: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string;
  brand: string;
  stock: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;
