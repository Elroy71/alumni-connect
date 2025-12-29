import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGN_HISTORY } from '../../graphql/funding.queries';
import { DollarSign, User, Calendar, Target, Check, X, Eye, History } from 'lucide-react';

const CATEGORY_LABELS = {
    'scholarship': 'Beasiswa',
    'research': 'Riset',
    'event': 'Event',
    'infrastructure': 'Infrastruktur',
    'SCHOLARSHIP': 'Beasiswa',
    'RESEARCH': 'Riset',
    'EVENT': 'Event',
    'INFRASTRUCTURE': 'Infrastruktur'
};

const STATUS_LABELS = {
    'active': 'Disetujui',
    'completed': 'Selesai',
    'rejected': 'Ditolak'
};

const FundingHistory = () => {
    const [filter, setFilter] = useState('all'); // 'all', 'approved', 'rejected'
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { data, loading, error } = useQuery(GET_CAMPAIGN_HISTORY);

    const formatAmount = (amount) => {
        if (!amount) return 'Rp 0';
        return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetail = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDetailModal(true);
    };

    if (loading) return <div className="loading">Memuat riwayat...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    const campaigns = data?.campaignHistory || [];

    const filteredCampaigns = campaigns.filter(campaign => {
        if (filter === 'all') return true;
        if (filter === 'approved') return campaign.status === 'active' || campaign.status === 'completed';
        if (filter === 'rejected') return campaign.status === 'rejected';
        return true;
    });

    const approvedCount = campaigns.filter(c => c.status === 'active' || c.status === 'completed').length;
    const rejectedCount = campaigns.filter(c => c.status === 'rejected').length;

    return (
        <div className="funding-history">
            <div className="page-header">
                <h1>
                    <History size={32} />
                    Riwayat Persetujuan Campaign
                </h1>
                <p className="page-subtitle">
                    Total: {campaigns.length} campaign ({approvedCount} disetujui, {rejectedCount} ditolak)
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Semua ({campaigns.length})
                </button>
                <button
                    className={`tab approved ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    <Check size={18} />
                    Disetujui ({approvedCount})
                </button>
                <button
                    className={`tab rejected ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    <X size={18} />
                    Ditolak ({rejectedCount})
                </button>
            </div>

            {/* Campaign List */}
            <div className="campaigns-table">
                {filteredCampaigns.length === 0 ? (
                    <div className="empty-state">
                        <History size={64} strokeWidth={1} />
                        <h3>Tidak ada riwayat</h3>
                        <p>Belum ada campaign yang diproses</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Kategori</th>
                                <th>Target Dana</th>
                                <th>Status</th>
                                <th>Tanggal Proses</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td>
                                        <div className="campaign-info">
                                            {campaign.imageUrl && (
                                                <img src={campaign.imageUrl} alt="" className="campaign-thumb" />
                                            )}
                                            <div>
                                                <span className="campaign-title">{campaign.title}</span>
                                                <span className="campaign-user">User: {campaign.userId?.slice(-8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">
                                            {CATEGORY_LABELS[campaign.category] || campaign.category}
                                        </span>
                                    </td>
                                    <td>{formatAmount(campaign.targetAmount)}</td>
                                    <td>
                                        <span className={`status-badge ${campaign.status}`}>
                                            {STATUS_LABELS[campaign.status] || campaign.status}
                                        </span>
                                    </td>
                                    <td>
                                        {campaign.status === 'rejected'
                                            ? formatDate(campaign.rejectedAt)
                                            : formatDate(campaign.approvedAt)
                                        }
                                    </td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewDetail(campaign)}
                                        >
                                            <Eye size={16} />
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedCampaign && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Detail Campaign</h3>

                        {selectedCampaign.imageUrl && (
                            <img
                                src={selectedCampaign.imageUrl}
                                alt={selectedCampaign.title}
                                className="detail-image"
                            />
                        )}

                        <div className="detail-grid">
                            <div className="detail-section">
                                <label>Judul:</label>
                                <p>{selectedCampaign.title}</p>
                            </div>

                            <div className="detail-section">
                                <label>Status:</label>
                                <p>
                                    <span className={`status-badge ${selectedCampaign.status}`}>
                                        {STATUS_LABELS[selectedCampaign.status] || selectedCampaign.status}
                                    </span>
                                </p>
                            </div>

                            <div className="detail-section">
                                <label>Kategori:</label>
                                <p>{CATEGORY_LABELS[selectedCampaign.category] || selectedCampaign.category}</p>
                            </div>

                            <div className="detail-section">
                                <label>Target Dana:</label>
                                <p>{formatAmount(selectedCampaign.targetAmount)}</p>
                            </div>

                            <div className="detail-section">
                                <label>Terkumpul:</label>
                                <p>{formatAmount(selectedCampaign.currentAmount)} ({selectedCampaign.progress?.toFixed(1)}%)</p>
                            </div>

                            <div className="detail-section">
                                <label>Dibuat:</label>
                                <p>{formatDate(selectedCampaign.createdAt)}</p>
                            </div>

                            {selectedCampaign.status === 'rejected' ? (
                                <>
                                    <div className="detail-section full-width">
                                        <label>Ditolak Pada:</label>
                                        <p>{formatDate(selectedCampaign.rejectedAt)}</p>
                                    </div>
                                    <div className="detail-section full-width rejection-section">
                                        <label>Alasan Penolakan:</label>
                                        <p className="rejection-reason">{selectedCampaign.rejectionReason || '-'}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="detail-section full-width">
                                    <label>Disetujui Pada:</label>
                                    <p>{formatDate(selectedCampaign.approvedAt)}</p>
                                </div>
                            )}

                            <div className="detail-section full-width">
                                <label>Deskripsi:</label>
                                <p className="description-text">{selectedCampaign.description}</p>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setShowDetailModal(false)} className="btn-close">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .funding-history {
          max-width: 1400px;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 16px;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .tab:hover {
          background: #e2e8f0;
        }

        .tab.active {
          background: #667eea;
          color: white;
        }

        .tab.approved.active {
          background: #10b981;
        }

        .tab.rejected.active {
          background: #ef4444;
        }

        .campaigns-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #f1f5f9;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .campaign-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .campaign-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }

        .campaign-title {
          display: block;
          font-weight: 600;
          color: #1e293b;
        }

        .campaign-user {
          font-size: 13px;
          color: #94a3b8;
        }

        .category-badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.active, .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-view {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: #e2e8f0;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-view:hover {
          background: #cbd5e1;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #94a3b8;
        }

        .empty-state h3 {
          margin-top: 16px;
          color: #64748b;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 32px;
          border-radius: 16px;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .detail-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .detail-section {
          margin-bottom: 8px;
        }

        .detail-section.full-width {
          grid-column: 1 / -1;
        }

        .detail-section label {
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .detail-section p {
          color: #1e293b;
          margin-top: 4px;
        }

        .description-text {
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .rejection-section {
          background: #fef2f2;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .rejection-reason {
          color: #991b1b !important;
          font-style: italic;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-close {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: #667eea;
          color: white;
        }

        .btn-close:hover {
          background: #5a67d8;
        }

        @media (max-width: 768px) {
          .filter-tabs {
            flex-wrap: wrap;
          }

          .campaigns-table {
            overflow-x: auto;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default FundingHistory;
