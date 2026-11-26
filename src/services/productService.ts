import { AxiosError } from 'axios';
import { api } from './api';
import { ApiRequestError } from './errors';
import type {
  Category,
  Product,
  ProductListResponse,
  ProductQuery,
} from '../types/product';
import { sortProducts } from '../utils/sort';

interface RawProduct {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  brand?: string;
  stock?: number;
  discountPercentage?: number;
  availabilityStatus?: string;
  sku?: string;
}

interface RawListResponse {
  products: RawProduct[];
  total: number;
}

const SELECT_FIELDS = [
  'id',
  'title',
  'description',
  'price',
  'category',
  'rating',
  'thumbnail',
  'images',
  'brand',
  'stock',
  'discountPercentage',
  'availabilityStatus',
  'sku',
].join(',');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRawList(value: unknown): value is RawListResponse {
  if (!isRecord(value)) return false;
  return Array.isArray(value.products) && typeof value.total === 'number';
}

function isRawProduct(value: unknown): value is RawProduct {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.price === 'number'
  );
}

function normalizeProduct(raw: RawProduct): Product {
  return {
    id: String(raw.id),
    source: 'api',
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : '',
    price: raw.price,
    category: typeof raw.category === 'string' ? raw.category : 'uncategorized',
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : undefined,
    images: Array.isArray(raw.images) ? raw.images : undefined,
    brand: typeof raw.brand === 'string' ? raw.brand : undefined,
    stock: typeof raw.stock === 'number' ? raw.stock : undefined,
    discountPercentage:
      typeof raw.discountPercentage === 'number' ? raw.discountPercentage : undefined,
    availabilityStatus:
      typeof raw.availabilityStatus === 'string' ? raw.availabilityStatus : undefined,
    sku: typeof raw.sku === 'string' ? raw.sku : undefined,
  };
}

function handleRequestError(error: unknown, fallback: string): never {
  if (error instanceof ApiRequestError) throw error;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 404) throw new ApiRequestError('Produk tidak ditemukan.', 404);
    if (status)
      throw new ApiRequestError(`${fallback} (server mengembalikan status ${status}).`, status);
    if (error.code === 'ECONNABORTED')
      throw new ApiRequestError('Permintaan habis waktu. Silakan coba lagi.');
    throw new ApiRequestError('Gagal terhubung ke jaringan. Periksa koneksi Anda lalu coba lagi.');
  }

  throw new ApiRequestError(fallback);
}

/**
 * DummyJSON does not support combining `q` and `category` in one request:
 * `/products/search` ignores `category`, and `/products` ignores both.
 * For that combination only, we fetch the matching search set once (limit=0)
 * and apply category filtering, sorting and pagination in the service layer.
 * All other combinations are handled fully by the API.
 */
export async function getProducts(
  query: ProductQuery,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  const limit = Math.min(Math.max(query.limit, 1), 100);
  const page = Math.max(1, query.page);
  const skip = (page - 1) * limit;

  if (query.q && query.category) {
    try {
      const response = await api.get('/products/search', {
        signal,
        params: { q: query.q, limit: 0, select: SELECT_FIELDS },
      });
      if (!isRawList(response.data))
        throw new ApiRequestError('Respons tidak sesuai dari API produk.');

      const matched = response.data.products
        .map(normalizeProduct)
        .filter((product) => product.category === query.category);
      const sorted = sortProducts(matched, query.sortBy, query.order);

      return {
        products: sorted.slice(skip, skip + limit),
        total: sorted.length,
        skip,
        limit,
      };
    } catch (error) {
      handleRequestError(error, 'Gagal mencari produk.');
    }
  }

  const endpoint = query.q
    ? '/products/search'
    : query.category
      ? `/products/category/${encodeURIComponent(query.category)}`
      : '/products';

  const params: Record<string, string | number> = { limit, skip, select: SELECT_FIELDS };
  if (query.q) params.q = query.q;
  if (query.sortBy) {
    params.sortBy = query.sortBy;
    params.order = query.order;
  }

  try {
    const response = await api.get(endpoint, { signal, params });
    if (!isRawList(response.data))
      throw new ApiRequestError('Respons tidak sesuai dari API produk.');

    return {
      products: response.data.products.map(normalizeProduct),
      total: response.data.total,
      skip,
      limit,
    };
  } catch (error) {
    handleRequestError(error, 'Gagal memuat produk.');
  }
}

export async function getProductDetail(
  productId: string,
  signal?: AbortSignal,
): Promise<Product> {
  try {
    const response = await api.get(`/products/${encodeURIComponent(productId)}`, { signal });
    if (!isRawProduct(response.data))
      throw new ApiRequestError('Respons produk tidak sesuai dari API.');
    return normalizeProduct(response.data);
  } catch (error) {
    handleRequestError(error, 'Gagal memuat produk ini.');
  }
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  try {
    const response = await api.get('/products/categories', { signal });
    const data: unknown = response.data;

    if (!Array.isArray(data)) throw new ApiRequestError('Respons kategori tidak sesuai.');

    return data
      .filter(
        (item): item is Category =>
          isRecord(item) && typeof item.slug === 'string' && typeof item.name === 'string',
      )
      .map((item) => ({ slug: item.slug, name: item.name, url: String(item.url ?? '') }));
  } catch (error) {
    handleRequestError(error, 'Gagal memuat kategori.');
  }
}
