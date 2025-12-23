import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  CreditCard, 
  MessageCircle, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  FileText,
  CalendarCheck,
  Heart
} from 'lucide-react';
import useAuthStore from '../features/auth/store/authStore';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/dashboard/profile' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Alumni Card', path: '/dashboard/card' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'Forum', path: '/dashboard/forum' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', path: '/dashboard/jobs' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Events', path: '/dashboard/events' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Funding', path: '/dashboard/funding' },
    
    // Divider
    { divider: true },
    
    // Quick Links
    { icon: <FileText className="w-4 h-4" />, label: 'My Applications', path: '/dashboard/my-applications', compact: true },
    { icon: <CalendarCheck className="w-4 h-4" />, label: 'My Events', path: '/dashboard/my-events', compact: true },
    { icon: <Heart className="w-4 h-4" />, label: 'My Donations', path: '/dashboard/my-donations', compact: true },
    
    // Divider
    { divider: true },
    
    // Settings
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-dark-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-dark-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-dark-700" />
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="hidden md:block">
                <h1 className="font-display font-bold text-lg text-dark-900">
                  Alumni Connect
                </h1>
                <p className="text-xs text-dark-500">Telkom University</p>
              </div>
            </Link>
          </div>

          {/* Center: Search (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-dark-100 transition-colors">
              <Bell className="w-6 h-6 text-dark-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-100 transition-colors"
              >
                <div className="hidden md:block text-right">
                  <p className="font-semibold text-sm text-dark-900">
                    {user?.profile?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-dark-500">
                    {user?.role || 'Alumni'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                  {user?.profile?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-dark-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-dark-200">
                      <p className="font-semibold text-dark-900">
                        {user?.profile?.fullName || 'User'}
                      </p>
                      <p className="text-sm text-dark-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-dark-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-dark-600" />
                      <span className="text-dark-900">My Profile</span>
                    </Link>
                    
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-dark-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-dark-600" />
                      <span className="text-dark-900">Settings</span>
                    </Link>
                    
                    <div className="border-t border-dark-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-dark-200 z-30
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <div key={`divider-${index}`} className="my-2 border-t border-dark-200" />
              );
            }
            
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-gradient-primary text-white shadow-lg' 
                      : 'text-dark-700 hover:bg-dark-100'
                    }
                    ${item.compact ? 'py-2' : ''}
                  `}
                >
                  <span className={item.compact ? 'opacity-70' : ''}>
                    {item.icon}
                  </span>
                  <span className={`font-semibold ${item.compact ? 'text-sm' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-200 bg-dark-50">
          <div className="text-center text-xs text-dark-500">
            <p className="font-semibold mb-1">Alumni Connect v1.0</p>
            <p>© 2024 Telkom University</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;