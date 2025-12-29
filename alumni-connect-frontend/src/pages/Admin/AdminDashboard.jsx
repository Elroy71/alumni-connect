import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PENDING_EVENTS, GET_EVENT_HISTORY } from '../../graphql/admin';
import { GET_PENDING_CAMPAIGNS, GET_CAMPAIGN_HISTORY } from '../../graphql/funding.queries';
import { Users, Calendar, DollarSign, FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: pendingEventsData, loading: loadingEvents } = useQuery(GET_PENDING_EVENTS, {
    fetchPolicy: 'network-only'
  });
  const { data: historyEventsData, loading: loadingEventsHistory } = useQuery(GET_EVENT_HISTORY, {
    fetchPolicy: 'network-only'
  });
  const { data: pendingCampaignsData, loading: loadingCampaigns } = useQuery(GET_PENDING_CAMPAIGNS, {
    fetchPolicy: 'network-only'
  });
  const { data: historyCampaignsData, loading: loadingCampaignsHistory } = useQuery(GET_CAMPAIGN_HISTORY, {
    fetchPolicy: 'network-only'
  });

  const loading = loadingEvents || loadingEventsHistory || loadingCampaigns || loadingCampaignsHistory;

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Memuat dashboard...</p>
      <style jsx>{`
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px;
                    color: #64748b;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e2e8f0;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );

  // Calculate stats from actual data
  const allEvents = pendingEventsData?.events?.events || [];
  const allEventHistory = historyEventsData?.events?.events || [];
  const pendingEvents = allEvents.filter(e => e.status === 'PENDING_APPROVAL');
  const approvedEvents = allEventHistory.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING' || e.status === 'COMPLETED');
  const rejectedEvents = allEventHistory.filter(e => e.status === 'REJECTED' || e.status === 'CANCELLED');

  const pendingCampaigns = pendingCampaignsData?.getPendingCampaigns?.campaigns || [];
  const approvedCampaigns = historyCampaignsData?.getCampaignHistory?.campaigns?.filter(c => c.status === 'ACTIVE' || c.status === 'PUBLISHED') || [];
  const rejectedCampaigns = historyCampaignsData?.getCampaignHistory?.campaigns?.filter(c => c.status === 'REJECTED') || [];

  const statCards = [
    {
      icon: Calendar,
      label: 'Event Pending',
      value: pendingEvents.length,
      subtext: `${approvedEvents.length} approved`,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      link: '/admin/events'
    },
    {
      icon: DollarSign,
      label: 'Campaign Pending',
      value: pendingCampaigns.length,
      subtext: `${approvedCampaigns.length} approved`,
      color: '#10b981',
      bgColor: '#ecfdf5',
      link: '/admin/funding'
    },
    {
      icon: CheckCircle,
      label: 'Total Approved',
      value: approvedEvents.length + approvedCampaigns.length,
      subtext: 'Events & Campaigns',
      color: '#059669',
      bgColor: '#d1fae5'
    },
    {
      icon: XCircle,
      label: 'Total Rejected',
      value: rejectedEvents.length + rejectedCampaigns.length,
      subtext: 'Events & Campaigns',
      color: '#ef4444',
      bgColor: '#fee2e2'
    }
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Dashboard Super Admin</h1>
      <p className="page-subtitle">Selamat datang kembali, lihat ringkasan aktivitas terbaru</p>

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
            description={`${pendingEvents.length} event menunggu approval`}
            link="/admin/events"
            color="#8b5cf6"
          />
          <ActionCard
            icon={DollarSign}
            title="Setujui Funding"
            description={`${pendingCampaigns.length} campaign menunggu approval`}
            link="/admin/funding"
            color="#10b981"
          />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2 className="section-title">Event Pending Terbaru</h2>
        {pendingEvents.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={32} />
            <p>Tidak ada event pending</p>
          </div>
        ) : (
          <div className="activity-list">
            {pendingEvents.slice(0, 5).map(event => (
              <div key={event.id} className="activity-item">
                <div className="activity-icon" style={{ background: '#f5f3ff' }}>
                  <Calendar size={20} color="#8b5cf6" />
                </div>
                <div className="activity-content">
                  <span className="activity-title">{event.title}</span>
                  <span className="activity-meta">{event.location} • {new Date(event.startDate).toLocaleDateString('id-ID')}</span>
                </div>
                <span className="status-badge pending">Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
                .admin-dashboard {
                    max-width: 1400px;
                }

                .page-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #1e293b;
                    margin-bottom: 8px;
                }

                .page-subtitle {
                    color: #64748b;
                    font-size: 16px;
                    margin-bottom: 32px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 20px;
                }

                .quick-actions {
                    margin-bottom: 40px;
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .activities-section {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                }

                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .activity-item:hover {
                    background: #f1f5f9;
                }

                .activity-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .activity-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .activity-title {
                    font-weight: 600;
                    color: #1e293b;
                }

                .activity-meta {
                    font-size: 13px;
                    color: #64748b;
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-badge.pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #94a3b8;
                }

                .empty-state p {
                    margin-top: 12px;
                }
            `}</style>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor, link }) => {
  const CardContent = () => (
    <div className="stat-card" style={{ '--card-color': color, '--card-bg': bgColor }}>
      <div className="stat-icon">
        <Icon size={24} color={color} />
      </div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        <span className="stat-subtext">{subtext}</span>
      </div>
      <style jsx>{`
                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    transition: all 0.3s;
                    cursor: ${link ? 'pointer' : 'default'};
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }

                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: var(--card-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }

                .stat-content {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--card-color);
                }

                .stat-label {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-top: 4px;
                }

                .stat-subtext {
                    font-size: 14px;
                    color: #64748b;
                    margin-top: 4px;
                }
            `}</style>
    </div>
  );

  return link ? (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

const ActionCard = ({ icon: Icon, title, description, link, color }) => (
  <Link to={link} className="action-card" style={{ textDecoration: 'none' }}>
    <div className="action-content" style={{ '--action-color': color }}>
      <div className="action-icon">
        <Icon size={24} color={color} />
      </div>
      <div className="action-text">
        <span className="action-title">{title}</span>
        <span className="action-desc">{description}</span>
      </div>
    </div>
    <style jsx>{`
            .action-content {
                background: white;
                border-radius: 16px;
                padding: 24px;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                transition: all 0.3s;
                border-left: 4px solid var(--action-color);
            }

            .action-content:hover {
                transform: translateX(8px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }

            .action-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: #f8fafc;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .action-text {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .action-title {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
            }

            .action-desc {
                font-size: 14px;
                color: #64748b;
            }
        `}</style>
  </Link>
);

export default AdminDashboard;
