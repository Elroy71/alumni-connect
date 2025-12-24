import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, DollarSign, Briefcase,
    Settings, LogOut, Menu, X, Bell, Search
} from 'lucide-react';
import useAuthStore from '../../features/auth/store/authStore';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Kelola User', path: '/admin/users' },
        { icon: Calendar, label: 'Event Approval', path: '/admin/events' },
        { icon: DollarSign, label: 'Funding Approval', path: '/admin/funding' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🎓</div>
                        {sidebarOpen && <span className="logo-text">AlumniConnect Admin</span>}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="header-right">
                        <div className="header-profile">
                            <div className="profile-avatar">SA</div>
                            <span className="profile-name">Super Admin</span>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }

        .admin-sidebar.open {
          width: 280px;
        }

        .admin-sidebar.closed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 32px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
        }

        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 16px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin-bottom: 8px;
          border-radius: 12px;
          color: white;
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 70%;
          background: white;
          border-radius: 0 4px 4px 0;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.02);
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }

        .admin-sidebar.closed + .admin-main {
          margin-left: 80px;
        }

        .admin-header {
          background: white;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .profile-name {
          font-weight: 600;
          color: #1e293b;
        }

        .admin-content {
          padding: 32px;
        }

        @media (max-width: 768px) {
          .admin-sidebar.open {
            width: 100%;
          }

          .admin-main {
            margin-left: 0;
          }

          .admin-sidebar.closed + .admin-main {
            margin-left: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
