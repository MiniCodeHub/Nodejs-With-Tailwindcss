import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Lock, User, Home, BarChart3, Settings, CheckCircle } from 'lucide-react';

// Types
interface User {
  email: string;
  name: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  loading: boolean;
  user: User | null;
  onRedirect: (path: string) => void;
}

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<AuthResult>;
  navigate: (path: string) => void;
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  navigate: (path: string) => void;
}

interface HomePageProps {
  navigate: (path: string) => void;
}

// Simulated auth service
const authService = {
  login: (email: string, password: string): Promise<AuthResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const user: User = { email, name: email.split('@')[0] };
          localStorage.setItem('user', JSON.stringify(user));
          resolve({ success: true, user });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 800);
    });
  },
  
  logout: (): void => {
    localStorage.removeItem('user');
  },
  
  checkAuth: (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userStr = localStorage.getItem('user');
        resolve(userStr ? JSON.parse(userStr) as User : null);
      }, 600);
    });
  }
};

// Router simulation
const useRouter = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  
  const navigate = (path: string): void => {
    setCurrentPath(path);
  };
  
  return { currentPath, navigate };
};

// Auth Context Hook
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async (): Promise<void> => {
    setLoading(true);
    const authUser = await authService.checkAuth();
    setUser(authUser);
    setLoading(false);
  };
  
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };
  
  const logout = (): void => {
    authService.logout();
    setUser(null);
  };
  
  return { user, loading, login, logout };
};

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, loading, user, onRedirect }) => {
  useEffect(() => {
    if (!loading && !user) {
      onRedirect('/login');
    }
  }, [loading, user, onRedirect]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <Shield className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
};

// Login Page
const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await onLogin(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Demo: Use any email and password to login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page
const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, navigate }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12%', icon: User },
    { label: 'Revenue', value: '$45,231', change: '+23%', icon: BarChart3 },
    { label: 'Active Sessions', value: '184', change: '+5%', icon: CheckCircle },
    { label: 'Server Status', value: 'Online', change: '99.9%', icon: Settings }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Protected Area</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-indigo-100">Here's what's happening with your account today.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'analytics', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Activity {i}</p>
                      <p className="text-sm text-gray-600">Completed successfully</p>
                    </div>
                    <span className="text-sm text-gray-500">{i}h ago</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600">Your detailed analytics and insights will appear here.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h3>
                <p className="text-gray-600">Manage your account preferences and security settings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Home Page
const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Next.js Auth Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Experience protected routes with authentication state management
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-lg shadow-indigo-200"
          >
            Sign In to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition border-2 border-gray-200"
          >
            Try Protected Route
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features Demonstrated</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>useState</strong> for auth state management</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>useEffect</strong> for checking authentication on mount</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Router redirect</strong> for unauthenticated users</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Loading states</strong> while verifying auth</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Conditional rendering</strong> based on auth status</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><strong>Tailwind CSS</strong> for modern, responsive UI</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const { user, loading, login, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  
  const handleLogout = (): void => {
    logout();
    navigate('/');
  };
  
  // Route rendering
  if (currentPath === '/login') {
    return <LoginPage onLogin={login} navigate={navigate} />;
  }
  
  if (currentPath === '/dashboard') {
    return (
      <ProtectedRoute loading={loading} user={user} onRedirect={navigate}>
        <DashboardPage user={user!} onLogout={handleLogout} navigate={navigate} />
      </ProtectedRoute>
    );
  }
  
  return <HomePage navigate={navigate} />;
}