# storeSukses — Product Catalog

Aplikasi katalog produk React + TypeScript + Vite untuk Tugas Pertemuan 8 (Website Application Development).

## Menjalankan proyek

```bash
npm install
npm run dev       # development server
npm run typecheck # TypeScript check
npm run build     # build produksi (tsc + vite)
npm run preview   # preview hasil build
```

## Keputusan yang sudah dikonfirmasi

| ID | Keputusan |
|---|---|
| OD-01 | DummyJSON (`https://dummyjson.com`) |
| OD-02 | Produk lokal disimpan di `localStorage` |
| OD-03 | Produk lokal tampil di bagian terpisah di `/products`, tidak dicampur ke pagination API |
| OD-04 | Favorit dapat berisi produk API **dan** produk lokal |
| OD-05 | 12 produk per halaman (opsi: 12 / 24 / 30) |
| OD-08 | Dark charcoal + aksen emerald (design tokens di `src/styles/tokens.css`) |

OD-06 (integrasi portfolio), OD-07 (nama repo/domain), dan deployment ditunda sampai tahap deployment.

## Routing

Semua halaman memakai satu root layout melalui nested route (`RootLayout` + `<Outlet />`).

| Route | Halaman |
|---|---|
| `/` | Redirect ke `/products` |
| `/products` | `ProductsPage` — katalog + bagian produk lokal |
| `/products/new` | `AddProductPage` — form produk lokal (static route diprioritaskan) |
| `/products/:productId` | `ProductDetailPage` — detail API atau produk lokal |
| `/saved` | `SavedProductsPage` |
| `*` | `NotFoundPage` |

Navigasi memakai `BrowserRouter`, `Link`, `NavLink`, dan `Navigate` (tanpa full-page reload).

## State management

- **Local state** — `useState` untuk input pencarian sementara, kontrol form, dan error validasi.
- **Global state** — `SavedProductsContext` + `useSavedProducts`; favorit dipersisten ke `localStorage` (`storeSukses:savedProducts:v1`).
- **Server state** — `useProducts`, `useProductDetail`, `useCategories` (Axios + `AbortController`, loading/error/empty handling).
- **URL state** — `useSearchParams` untuk `q`, `category`, `sortBy`, `order`, `page`, `limit`.
- **Form state** — controlled components + `validateProductForm`.

Contoh URL:
`/products?q=phone&category=smartphones&sortBy=price&order=asc&page=2&limit=12`

## API

Layer API terpisah dari UI:

- `src/services/api.ts` — Axios instance (`baseURL`, timeout).
- `src/services/productService.ts` — daftar produk, detail, kategori.
- `src/services/errors.ts` — tipe error dan pesan ramah pengguna.
- `src/services/localProductService.ts` — produk lokal (localStorage, bukan API).

Endpoint DummyJSON yang dipakai:

| Kebutuhan | Endpoint |
|---|---|
| Daftar produk | `GET /products?limit&skip&sortBy&order&select` |
| Pencarian | `GET /products/search?q&limit&skip&sortBy&order&select` |
| Kategori | `GET /products/categories` |
| Filter kategori | `GET /products/category/:slug?limit&skip&sortBy&order&select` |
| Detail | `GET /products/:id` |

**Fallback yang didokumentasikan:** DummyJSON tidak menerima `q` dan `category` secara bersamaan (`/products/search` mengabaikan `category`, `/products` mengabaikan keduanya). Hanya untuk kombinasi tersebut, service mengambil seluruh hasil pencarian sekali (`limit=0`) lalu melakukan filter kategori, sorting, dan pagination di `src/utils/sort.ts` + service. Kombinasi lain sepenuhnya memakai API. Perilaku sorting dan pagination tetap sesuai ekspektasi pengguna.

Produk lokal tidak pernah dikirim ke server eksternal dan diberi ID berprefix `local-`.

## Custom hooks

| Hook | Tanggung jawab |
|---|---|
| `useProducts` | Request daftar produk, loading/error, refetch, re-request saat parameter URL berubah |
| `useProductDetail` | Detail produk API atau lokal, penanganan ID invalid / not found |
| `useCategories` | Mengambil daftar kategori dengan cache dalam sesi browser |
| `useDebounce` | Menunda update URL saat pengguna mengetik pencarian |
| `useLocalProducts` | Membaca/menulis/menghapus produk lokal di localStorage |

## Struktur folder

```text
src/
├── assets/
├── components/
│   ├── common/     LoadingState, ErrorState, EmptyState, RatingBadge, SourceBadge, SaveButton, ProductImage
│   ├── layout/     RootLayout, Navbar, Footer
│   ├── products/   SearchBar, CategoryFilter, SortControls, Pagination, ProductCard, ProductGrid, LocalProductsSection
│   └── forms/      FormField, AddProductForm
├── pages/          ProductsPage, ProductDetailPage, SavedProductsPage, AddProductPage, NotFoundPage
├── hooks/          useProducts, useProductDetail, useCategories, useDebounce, useLocalProducts
├── services/       api, productService, localProductService, errors
├── context/        SavedProductsContext
├── types/          product.ts
├── routes/         AppRoutes.tsx
├── utils/          format, validation, storage, sort
├── styles/         tokens, global, components
├── App.tsx
└── main.tsx
```

Folder wajib dosen (`components`, `pages`, `hooks`, `services`, `context`) tersedia. Komponen reusable yang dipakai berulang: `ProductCard`, `ProductGrid`, `SaveButton`, `ProductImage`, `SearchBar`, `CategoryFilter`, `Pagination`, `LoadingState`, `ErrorState`, `EmptyState`.

## Verifikasi manual

- [ ] Routing, nested route, dynamic route, redirect, 404
- [ ] Listing, detail, pencarian, filter kategori, sorting, pagination
- [ ] Perubahan search/filter mengembalikan halaman ke 1
- [ ] Context API + persistensi favorit setelah refresh
- [ ] Form validasi + feedback sukses, produk lokal muncul di bagian Local
- [ ] Loading / error / empty state (termasuk ID tidak ditemukan)
- [ ] Responsive desktop/tablet/mobile
- [ ] `npm run build` berhasil
