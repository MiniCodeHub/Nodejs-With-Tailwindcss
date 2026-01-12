import React, { useState, useMemo } from 'react';
import { Search, X, Filter, ShoppingBag } from 'lucide-react';

const products = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 199, brand: 'AudioTech', rating: 4.5, inStock: true },
  { id: 2, name: 'Running Shoes', category: 'Sports', price: 89, brand: 'SportMax', rating: 4.8, inStock: true },
  { id: 3, name: 'Coffee Maker', category: 'Home', price: 149, brand: 'BrewMaster', rating: 4.3, inStock: false },
  { id: 4, name: 'Yoga Mat', category: 'Sports', price: 35, brand: 'FitLife', rating: 4.6, inStock: true },
  { id: 5, name: 'Smartphone', category: 'Electronics', price: 699, brand: 'TechCorp', rating: 4.7, inStock: true },
  { id: 6, name: 'Desk Lamp', category: 'Home', price: 45, brand: 'LightWorks', rating: 4.2, inStock: true },
  { id: 7, name: 'Bluetooth Speaker', category: 'Electronics', price: 79, brand: 'AudioTech', rating: 4.4, inStock: true },
  { id: 8, name: 'Cooking Pan Set', category: 'Home', price: 129, brand: 'ChefPro', rating: 4.9, inStock: true },
  { id: 9, name: 'Tennis Racket', category: 'Sports', price: 159, brand: 'SportMax', rating: 4.5, inStock: false },
  { id: 10, name: 'Smart Watch', category: 'Electronics', price: 299, brand: 'TechCorp', rating: 4.6, inStock: true },
  { id: 11, name: 'Dumbbells Set', category: 'Sports', price: 99, brand: 'FitLife', rating: 4.7, inStock: true },
  { id: 12, name: 'Blender', category: 'Home', price: 89, brand: 'BrewMaster', rating: 4.4, inStock: true },
];

const categories = ['All', 'Electronics', 'Sports', 'Home'];
const brands = ['All', ...new Set(products.map(p => p.brand))];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: Infinity },
];

export default function SearchFilterCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(true);

  // Derived state: filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Price range filter
    const range = priceRanges[selectedPriceRange];
    result = result.filter(p => p.price >= range.min && p.price < range.max);

    // Stock filter
    if (showInStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, selectedPriceRange, showInStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedPriceRange(0);
    setShowInStockOnly(false);
    setSortBy('name');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedPriceRange !== 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Product Catalog</h1>
          </div>
          <p className="text-slate-600">Search and filter through our collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or brand..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-lg transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Category</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat}
                      {cat !== 'All' && (
                        <span className="ml-2 text-xs text-slate-500">
                          ({products.filter(p => p.category === cat).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Price Range</label>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPriceRange(idx)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedPriceRange === idx
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">In Stock Only</span>
                </label>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">{filteredProducts.length}</span> products found
              </p>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search query</p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                      <ShoppingBag className="w-16 h-16 text-indigo-300 group-hover:scale-110 transition-transform" />
                      {!product.inStock && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                      {product.inStock && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          In Stock
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{product.brand}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-slate-800">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                        </div>
                      </div>
                      <button
                        disabled={!product.inStock}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}