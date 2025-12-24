import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '../../graphql/admin';
import { Users, Calendar, DollarSign, FileText, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Memuat dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p>Error: {error.message}</p>
        </div>
    );

    const stats = data?.getDashboardStats?.stats;
    const recentActivities = data?.getDashboardStats?.recentActivities;

    const statCards = [
        {
            icon: Users,
            label: 'Total Users',
            value: stats?.users?.total || 0,
            subtext: `${stats?.users?.active || 0} active`,
            color: '#3b82f6',
            bgColor: '#eff6ff'
        },
        {
            icon: Calendar,
            label: 'Pending Events',
            value: stats?.events?.pending || 0,
            subtext: `${stats?.events?.total || 0} total events`,
            color: '#8b5cf6',
            bgColor: '#f5f3ff',
            link: '/admin/events'
        },
        {
            icon: DollarSign,
            label: 'Pending Campaigns',
            value: stats?.campaigns?.pending || 0,
            subtext: `${stats?.campaigns?.total || 0} total campaigns`,
            color: '#10b981',
            bgColor: '#ecfdf5',
            link: '/admin/funding'
        },
        {
            icon: FileText,
            label: 'Total Posts',
            value: stats?.posts?.total || 0,
            subtext: 'Forum discussions',
            color: '#f59e0b',
            bgColor: '#fffbeb'
        }
    ];

    return (
        <div className="admin-dashboard">
            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2 className="section-title">Tindakan Cepat</h2>
                <div className="actions-grid">
                    <ActionCard
                        icon={Calendar}
                        title="Setujui Event"
                        description={`${stats?.events?.pending || 0} event menunggu approval`}
                        link="/admin/events"
                        color="#8b5cf6"
                    />
                    <ActionCard
                        icon={DollarSign}
                        title="Setujui Campaign"
                        description={`${stats?.campaigns?.pending || 0} campaign menunggu approval`}
                        link="/admin/funding"
                        color="#10b981"
                    />
                    <ActionCard
                        icon={Users}
                        title="Kelola User"
                        description="Manage dan moderasi user"
                        link="/admin/users"
                        color="#3b82f6"
                    />
                </div>
            </div>

            {/* Recent Activities */}
            <div className="recent-activities">
                <h2 className="section-title">Aktivitas Terbaru</h2>
                <div className="activities-grid">
                    <ActivitySection
                        title="User Baru"
                        icon={Users}
                        items={recentActivities?.users || []}
                        renderItem={(user) => (
                            <div className="activity-item">
                                <div className="activity-avatar">
                                    {user.profile?.avatar ? (
                                        <img src={user.profile.avatar} alt="" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user.profile?.fullName?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="activity-info">
                                    <p className="activity-name">{user.profile?.fullName || 'Unknown'}</p>
                                    <p className="activity-detail">{user.email}</p>
                                </div>
                                <span className="activity-time">{formatTime(user.createdAt)}</span>
                            </div>
                        )}
                    />

                    <ActivitySection
                        title="Event Pending"
                        icon={Calendar}
                        items={recentActivities?.events || []}
                        renderItem={(event) => (
                            <div className="activity-item">
                                <div className="activity-info">
                                    <p className="activity-name">{event.title}</p>
                                    <p className="activity-detail">
                                        Oleh {event.organizer?.profile?.fullName || 'Unknown'}
                                    </p>
                                </div>
                                <span className="activity-badge pending">Pending</span>
                            </div>
                        )}
                    />

                    <ActivitySection
                        title="Campaign Pending"
                        icon={DollarSign}
                        items={recentActivities?.campaigns || []}
                        renderItem={(campaign) => (
                            <div className="activity-item">
                                <div className="activity-info">
                                    <p className="activity-name">{campaign.title}</p>
                                    <p className="activity-detail">
                                        Oleh {campaign.creator?.profile?.fullName || 'Unknown'}
                                    </p>
                                </div>
                                <span className="activity-badge pending">Pending</span>
                            </div>
                        )}
                    />
                </div>
            </div>

            <style jsx>{`
        .admin-dashboard {
          max-width: 1400px;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .quick-actions, .recent-activities {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .activity-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .activity-info {
          flex: 1;
        }

        .activity-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .activity-detail {
          font-size: 14px;
          color: #64748b;
        }

        .activity-time {
          font-size: 13px;
          color: #94a3b8;
        }

        .activity-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .activity-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        @media (max-width: 768px) {
          .stats-grid,
          .actions-grid,
          .activities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor, link }) => {
    const CardContent = () => (
        <>
            <div className="stat-icon" style={{ background: bgColor, color }}>
                <Icon size={24} />
            </div>
            <div className="stat-content">
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
                <p className="stat-subtext">{subtext}</p>
            </div>
            <style jsx>{`
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-subtext {
          font-size: 14px;
          color: #94a3b8;
        }
      `}</style>
        </>
    );

    if (link) {
        return (
            <Link to={link} className="stat-card clickable">
                <CardContent />
                <style jsx>{`
          .stat-card {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
            text-decoration: none;
            display: block;
          }

          .stat-card.clickable:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          }
        `}</style>
            </Link>
        );
    }

    return (
        <div className="stat-card">
            <CardContent />
            <style jsx>{`
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
      `}</style>
        </div>
    );
};

const ActionCard = ({ icon: Icon, title, description, link, color }) => (
    <Link to={link} className="action-card">
        <div className="action-icon" style={{ background: `${color}20`, color }}>
            <Icon size={24} />
        </div>
        <div className="action-content">
            <h3 className="action-title">{title}</h3>
            <p className="action-description">{description}</p>
        </div>
        <style jsx>{`
      .action-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        display: flex;
        gap: 16px;
        align-items: center;
        text-decoration: none;
        transition: all 0.2s;
      }

      .action-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .action-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .action-description {
        font-size: 14px;
        color: #64748b;
      }
    `}</style>
    </Link>
);

const ActivitySection = ({ title, icon: Icon, items, renderItem }) => (
    <div className="activity-section">
        <div className="activity-header">
            <Icon size={20} />
            <h3>{title}</h3>
        </div>
        <div className="activity-list">
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div key={index}>{renderItem(item)}</div>
                ))
            ) : (
                <p className="empty-state">Tidak ada {title.toLowerCase()}</p>
            )}
        </div>
        <style jsx>{`
      .activity-section {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .activity-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .activity-header h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }

      .activity-list {
        max-height: 400px;
        overflow-y: auto;
      }

      .empty-state {
        text-align: center;
        color: #94a3b8;
        padding: 32px;
        font-size: 14px;
      }
    `}</style>
    </div>
);

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID');
};

export default AdminDashboard;
