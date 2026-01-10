import { useState } from 'react';

// Type definitions
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Fake product data
const PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'Electronics' },
  { id: 2, name: 'Leather Wallet', price: 34.99, category: 'Accessories' },
  { id: 3, name: 'Stainless Steel Water Bottle', price: 24.99, category: 'Home' },
  { id: 4, name: 'Running Shoes', price: 89.99, category: 'Sports' },
  { id: 5, name: 'Desk Lamp', price: 45.99, category: 'Home' },
  { id: 6, name: 'Yoga Mat', price: 29.99, category: 'Sports' },
  { id: 7, name: 'Coffee Maker', price: 129.99, category: 'Kitchen' },
  { id: 8, name: 'Backpack', price: 54.99, category: 'Accessories' },
  { id: 9, name: 'Smart Watch', price: 199.99, category: 'Electronics' },
  { id: 10, name: 'Sunglasses', price: 39.99, category: 'Accessories' },
  { id: 11, name: 'Bluetooth Speaker', price: 69.99, category: 'Electronics' },
  { id: 12, name: 'Notebook Set', price: 14.99, category: 'Office' },
  { id: 13, name: 'Travel Mug', price: 19.99, category: 'Kitchen' },
  { id: 14, name: 'Phone Case', price: 24.99, category: 'Electronics' },
  { id: 15, name: 'Resistance Bands', price: 34.99, category: 'Sports' },
  { id: 16, name: 'Canvas Tote Bag', price: 16.99, category: 'Accessories' },
  { id: 17, name: 'Desk Organizer', price: 27.99, category: 'Office' },
  { id: 18, name: 'Portable Charger', price: 39.99, category: 'Electronics' },
  { id: 19, name: 'Kitchen Knife Set', price: 79.99, category: 'Kitchen' },
  { id: 20, name: 'Foam Roller', price: 29.99, category: 'Sports' },
  { id: 21, name: 'Wireless Mouse', price: 34.99, category: 'Electronics' },
  { id: 22, name: 'Tea Infuser', price: 12.99, category: 'Kitchen' },
  { id: 23, name: 'Laptop Stand', price: 49.99, category: 'Office' },
  { id: 24, name: 'Dumbbell Set', price: 89.99, category: 'Sports' },
  { id: 25, name: 'Wall Clock', price: 44.99, category: 'Home' },
];

// Reusable Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Previous
      </button>
      
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Next
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Derived data: calculate total pages
  const totalPages = Math.ceil(PRODUCTS.length / itemsPerPage);
  
  // Derived data: slice products for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = PRODUCTS.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Product Catalog
          </h1>
          <p className="text-gray-600">
            Browse {PRODUCTS.length} products with client-side pagination
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(indexOfLastItem, PRODUCTS.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900">{PRODUCTS.length}</span> products
          </div>
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <div className="text-6xl">📦</div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {product.name}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-2">
                    {product.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}