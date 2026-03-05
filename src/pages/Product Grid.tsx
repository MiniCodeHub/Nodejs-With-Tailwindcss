import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Category = "Electronics" | "Sports" | "Accessories" | "Kitchen";
type SortKey  = "default" | "price_asc" | "price_desc" | "rating_desc";
type BadgeLabel = "Best Seller" | "New" | "Sale" | "Premium";

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  rating: number;
  img: string;
  badge: BadgeLabel | null;
}

interface StarRatingProps {
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

interface SortOption {
  label: string;
  value: SortKey;
}

// ── Data ───────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1,  name: "Wireless Headphones",  category: "Electronics",  price: 79.99,  rating: 4.5, img: "🎧", badge: "Best Seller" },
  { id: 2,  name: "Running Shoes",         category: "Sports",       price: 59.99,  rating: 4.2, img: "👟", badge: null },
  { id: 3,  name: "Minimalist Watch",      category: "Accessories",  price: 129.99, rating: 4.8, img: "⌚", badge: "Premium" },
  { id: 4,  name: "Yoga Mat",              category: "Sports",       price: 29.99,  rating: 4.3, img: "🧘", badge: null },
  { id: 5,  name: "Coffee Maker",          category: "Kitchen",      price: 89.99,  rating: 4.6, img: "☕", badge: "New" },
  { id: 6,  name: "Leather Wallet",        category: "Accessories",  price: 39.99,  rating: 4.1, img: "👜", badge: null },
  { id: 7,  name: "Smart Speaker",         category: "Electronics",  price: 49.99,  rating: 4.4, img: "🔊", badge: "Sale" },
  { id: 8,  name: "Blender Pro",           category: "Kitchen",      price: 69.99,  rating: 4.0, img: "🍹", badge: null },
  { id: 9,  name: "Mechanical Keyboard",   category: "Electronics",  price: 109.99, rating: 4.7, img: "⌨️", badge: "New" },
  { id: 10, name: "Backpack Ultra",        category: "Accessories",  price: 54.99,  rating: 4.2, img: "🎒", badge: null },
  { id: 11, name: "Resistance Bands",      category: "Sports",       price: 19.99,  rating: 4.5, img: "💪", badge: "Sale" },
  { id: 12, name: "Air Purifier",          category: "Electronics",  price: 149.99, rating: 4.6, img: "💨", badge: "Best Seller" },
];

const CATEGORIES: string[] = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

const SORT_OPTIONS: SortOption[] = [
  { label: "Default",            value: "default"      },
  { label: "Price: Low to High", value: "price_asc"    },
  { label: "Price: High to Low", value: "price_desc"   },
  { label: "Top Rated",          value: "rating_desc"  },
];

const BADGE_STYLES: Record<BadgeLabel, string> = {
  "Best Seller": "bg-amber-100 text-amber-700",
  "New":         "bg-emerald-100 text-emerald-700",
  "Sale":        "bg-red-100 text-red-600",
  "Premium":     "bg-violet-100 text-violet-700",
};

// ── Sub-components ─────────────────────────────────────────────────────────
function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.95 2.778c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product }: ProductCardProps) {
  const [inCart, setInCart] = useState<boolean>(false);
  const [wishlisted, setWishlisted] = useState<boolean>(false);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl
        transition-all duration-200 hover:-translate-y-1 flex flex-col overflow-hidden group"
      role="article"
      aria-label={product.name}
    >
      {/* Thumbnail */}
      <div className="relative bg-gradient-to-br from-indigo-50 to-violet-50 h-44 flex items-center justify-center">
        <span className="text-6xl select-none" role="img" aria-label={product.name}>
          {product.img}
        </span>

        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full
              ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={() => setWishlisted((w) => !w)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm
            flex items-center justify-center transition-all duration-200
            opacity-0 group-hover:opacity-100
            ${wishlisted ? "text-red-500 scale-110" : "text-gray-300 hover:text-red-400"}`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-medium text-indigo-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 leading-tight">{product.name}</h3>
        <StarRating rating={product.rating} />

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">${product.price.toFixed(2)}</span>
          <button
            onClick={() => setInCart((c) => !c)}
            aria-label={inCart ? "Remove from cart" : "Add to cart"}
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200
              ${inCart
                ? "bg-emerald-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"}`}
          >
            {inCart ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [search, setSearch] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(200);

  const filtered: Product[] = useMemo(() => {
    let items = PRODUCTS.filter((p) => {
      const matchCat    = activeCategory === "All" || p.category === activeCategory;
      const matchPrice  = p.price <= maxPrice;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });

    const sorted: Record<SortKey, () => Product[]> = {
      default:      () => items,
      price_asc:    () => [...items].sort((a, b) => a.price - b.price),
      price_desc:   () => [...items].sort((a, b) => b.price - a.price),
      rating_desc:  () => [...items].sort((a, b) => b.rating - a.rating),
    };

    return sorted[sortBy]();
  }, [activeCategory, sortBy, search, maxPrice]);

  const handleClearFilters = (): void => {
    setActiveCategory("All");
    setSearch("");
    setMaxPrice(200);
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">🛍️ Shop</h1>

          <div className="relative flex-1 max-w-xs">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              aria-label="Search products"
              className="w-full pl-8 pr-4 py-2 text-sm bg-gray-100 border border-gray-200
                rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs" aria-hidden="true">🔍</span>
          </div>

          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as SortKey)}
            aria-label="Sort products"
            className="text-sm bg-gray-100 border border-gray-200 rounded-xl px-3 py-2
              outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer transition"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-6" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-4 mb-8 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
          <label htmlFor="priceRange" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Max Price:
          </label>
          <input
            id="priceRange"
            type="range"
            min={10}
            max={200}
            step={5}
            value={maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-indigo-600"
            aria-valuemin={10}
            aria-valuemax={200}
            aria-valuenow={maxPrice}
            aria-label={`Max price: $${maxPrice}`}
          />
          <span className="text-sm font-bold text-indigo-600 w-16 text-right">${maxPrice}</span>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
          of {PRODUCTS.length} products
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="font-medium">No products match your filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-indigo-600 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}