import { useState, useEffect } from 'react';

// Type definition for User
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  company: {
    name: string;
  };
  address: {
    city: string;
  };
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-300 rounded"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
    </div>
  </div>
);

// User Card Component
const UserCard = ({ user }: { user: User }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg">
        {user.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
        <p className="text-gray-500 text-sm">@{user.username}</p>
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <p className="flex items-center">
        <span className="mr-2">📧</span>
        {user.email}
      </p>
      <p className="flex items-center">
        <span className="mr-2">🏢</span>
        {user.company.name}
      </p>
      <p className="flex items-center">
        <span className="mr-2">📍</span>
        {user.address.city}
      </p>
    </div>
  </div>
);

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with delay
    const fetchUsers = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fetch from JSONPlaceholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setUsers([]);
    setLoading(true);
    
    // Refetch data
    setTimeout(async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            User Directory
          </h1>
          <p className="text-gray-600 mb-6">
            {loading 
              ? 'Loading user data...' 
              : `Showing ${users.length} users`
            }
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            // Show actual user cards when data is loaded
            users.map(user => (
              <UserCard key={user.id} user={user} />
            ))
          )}
        </div>

        {/* Footer Info */}
        {!loading && (
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Data loaded from JSONPlaceholder API</p>
          </div>
        )}
      </div>
    </div>
  );
}