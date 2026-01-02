import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_CAMPAIGNS, GET_CAMPAIGN_HISTORY } from '../../graphql/funding.queries';
import { APPROVE_CAMPAIGN, REJECT_CAMPAIGN } from '../../graphql/funding.mutations';
import { DollarSign, User, Calendar, Target, Check, X, Eye, History, ChevronDown, ChevronUp } from 'lucide-react';

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

const FundingApproval = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(true);

  const { data: pendingData, loading: loadingPending, refetch: refetchPending } = useQuery(GET_PENDING_CAMPAIGNS, {
    fetchPolicy: 'network-only'
  });
  const { data: historyData, loading: loadingHistory, refetch: refetchHistory } = useQuery(GET_CAMPAIGN_HISTORY, {
    fetchPolicy: 'network-only'
  });

  const [approveCampaign, { loading: approving }] = useMutation(APPROVE_CAMPAIGN, {
    onCompleted: () => {
      refetchPending();
      refetchHistory();
      alert('Campaign berhasil disetujui!');
    },
    onError: (error) => {
      alert('Gagal menyetujui campaign: ' + error.message);
    }
  });

  const [rejectCampaign, { loading: rejecting }] = useMutation(REJECT_CAMPAIGN, {
    onCompleted: () => {
      refetchPending();
      refetchHistory();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedCampaign(null);
      alert('Campaign telah ditolak');
    },
    onError: (error) => {
      alert('Gagal menolak campaign: ' + error.message);
    }
  });

  const handleApprove = (id) => {
    if (confirm('Apakah Anda yakin ingin menyetujui campaign ini?')) {
      approveCampaign({ variables: { id } });
    }
  };

  const handleReject = (campaign) => {
    setSelectedCampaign(campaign);
    setShowRejectModal(true);
  };

  const handleViewDetail = (campaign, isHistory = false) => {
    setSelectedCampaign({ ...campaign, isHistory });
    setShowDetailModal(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }
    rejectCampaign({
      variables: {
        id: selectedCampaign.id,
        reason: rejectReason
      }
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCampaigns = pendingData?.pendingCampaigns || [];
  const historyCampaigns = historyData?.campaignHistory || [];

  const filteredHistory = historyCampaigns.filter(campaign => {
    const status = campaign.status?.toLowerCase();
    if (historyFilter === 'all') return true;
    if (historyFilter === 'approved') return status === 'active' || status === 'completed';
    if (historyFilter === 'rejected') return status === 'rejected';
    return true;
  });

  const approvedCount = historyCampaigns.filter(c => c.status?.toLowerCase() === 'active' || c.status?.toLowerCase() === 'completed').length;
  const rejectedCount = historyCampaigns.filter(c => c.status?.toLowerCase() === 'rejected').length;

  if (loadingPending) return <div className="loading">Memuat...</div>;

  return (
    <div className="funding-approval">
      {/* Pending Campaigns Section */}
      <div className="page-header">
        <h1>Persetujuan Funding</h1>
        <p className="page-subtitle">{pendingCampaigns.length} campaign menunggu persetujuan</p>
      </div>

      <div className="campaigns-grid">
        {pendingCampaigns.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={64} strokeWidth={1} />
            <h3>Tidak ada campaign pending</h3>
            <p>Semua campaign telah direview</p>
          </div>
        ) : (
          pendingCampaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              {campaign.imageUrl && (
                <div className="campaign-image">
                  <img src={campaign.imageUrl} alt={campaign.title} />
                  <div className="campaign-badge">MENUNGGU</div>
                </div>
              )}

              <div className="campaign-content">
                <div className="campaign-category">
                  {CATEGORY_LABELS[campaign.category] || campaign.category}
                </div>
                <h3 className="campaign-title">{campaign.title}</h3>

                <div className="campaign-meta">
                  <div className="meta-item">
                    <User size={16} />
                    <span>User ID: {campaign.userId?.slice(-8) || '-'}</span>
                  </div>
                  <div className="meta-item">
                    <Target size={16} />
                    <span>Target: {formatAmount(campaign.targetAmount)}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Deadline: {formatDate(campaign.endDate)}</span>
                  </div>
                </div>

                <p className="campaign-description">{campaign.description}</p>

                <div className="campaign-actions">
                  <button
                    className="btn-view"
                    onClick={() => handleViewDetail(campaign, false)}
                  >
                    <Eye size={18} />
                    Detail
                  </button>
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(campaign.id)}
                    disabled={approving}
                  >
                    <Check size={18} />
                    Setujui
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(campaign)}
                    disabled={rejecting}
                  >
                    <X size={18} />
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History Section */}
      <div className="history-section">
        <div className="history-header" onClick={() => setShowHistory(!showHistory)}>
          <div className="history-title">
            <History size={24} />
            <h2>Riwayat Persetujuan</h2>
            <span className="history-count">({historyCampaigns.length})</span>
          </div>
          <button className="toggle-btn">
            {showHistory ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>

        {showHistory && (
          <>
            <div className="filter-tabs">
              <button
                className={`tab ${historyFilter === 'all' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('all')}
              >
                Semua ({historyCampaigns.length})
              </button>
              <button
                className={`tab approved ${historyFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('approved')}
              >
                <Check size={16} />
                Disetujui ({approvedCount})
              </button>
              <button
                className={`tab rejected ${historyFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('rejected')}
              >
                <X size={16} />
                Ditolak ({rejectedCount})
              </button>
            </div>

            {loadingHistory ? (
              <div className="loading">Memuat riwayat...</div>
            ) : filteredHistory.length === 0 ? (
              <div className="empty-history">
                <p>Tidak ada riwayat</p>
              </div>
            ) : (
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Kategori</th>
                      <th>Target</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>
                          <div className="campaign-info">
                            {campaign.imageUrl && (
                              <img src={campaign.imageUrl} alt="" className="campaign-thumb" />
                            )}
                            <div>
                              <span className="campaign-name">{campaign.title}</span>
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
                            ? formatDateTime(campaign.rejectedAt)
                            : formatDateTime(campaign.approvedAt)
                          }
                        </td>
                        <td>
                          <button
                            className="btn-view-small"
                            onClick={() => handleViewDetail(campaign, true)}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tolak Campaign</h3>
            <p><strong>Campaign:</strong> {selectedCampaign?.title}</p>
            <textarea
              className="reject-reason"
              placeholder="Alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel">Batal</button>
              <button onClick={submitReject} className="btn-submit" disabled={rejecting}>
                {rejecting ? 'Memproses...' : 'Tolak Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>Detail Campaign</h3>

            {selectedCampaign.imageUrl && (
              <img
                src={selectedCampaign.imageUrl}
                alt={selectedCampaign.title}
                className="detail-image"
              />
            )}

            <div className="detail-section">
              <label>Judul:</label>
              <p>{selectedCampaign.title}</p>
            </div>

            {selectedCampaign.isHistory && (
              <div className="detail-section">
                <label>Status:</label>
                <p>
                  <span className={`status-badge ${selectedCampaign.status}`}>
                    {STATUS_LABELS[selectedCampaign.status] || selectedCampaign.status}
                  </span>
                </p>
              </div>
            )}

            <div className="detail-section">
              <label>Kategori:</label>
              <p>{CATEGORY_LABELS[selectedCampaign.category] || selectedCampaign.category}</p>
            </div>

            <div className="detail-section">
              <label>Target Dana:</label>
              <p>{formatAmount(selectedCampaign.targetAmount)}</p>
            </div>

            <div className="detail-section">
              <label>Batas Waktu:</label>
              <p>{formatDate(selectedCampaign.endDate)}</p>
            </div>

            <div className="detail-section">
              <label>Deskripsi:</label>
              <p className="description-text">{selectedCampaign.description}</p>
            </div>

            <div className="detail-section">
              <label>Dibuat Pada:</label>
              <p>{formatDate(selectedCampaign.createdAt)}</p>
            </div>

            {selectedCampaign.isHistory && selectedCampaign.status === 'rejected' && (
              <div className="detail-section rejection-section">
                <label>Alasan Penolakan:</label>
                <p className="rejection-reason">{selectedCampaign.rejectionReason || '-'}</p>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowDetailModal(false)} className="btn-cancel">Tutup</button>
              {!selectedCampaign.isHistory && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleApprove(selectedCampaign.id);
                    }}
                    className="btn-approve"
                    disabled={approving}
                  >
                    <Check size={18} />
                    Setujui
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedCampaign);
                    }}
                    className="btn-reject"
                  >
                    <X size={18} />
                    Tolak
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .funding-approval {
          max-width: 1400px;
        }

        .loading {
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
        }

        .page-subtitle {
          color: #64748b;
          font-size: 16px;
        }

        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .campaign-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
        }

        .campaign-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .campaign-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .campaign-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .campaign-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #fbbf24;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
        }

        .campaign-content {
          padding: 24px;
        }

        .campaign-category {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .campaign-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .campaign-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
        }

        .campaign-description {
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .campaign-actions {
          display: flex;
          gap: 12px;
        }

        .btn-view, .btn-approve, .btn-reject {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-view {
          background: #e2e8f0;
          color: #475569;
        }

        .btn-view:hover {
          background: #cbd5e1;
        }

        .btn-approve {
          background: #10b981;
          color: white;
        }

        .btn-approve:hover:not(:disabled) {
          background: #059669;
        }

        .btn-approve:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover:not(:disabled) {
          background: #dc2626;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          background: white;
          border-radius: 16px;
        }

        .empty-state h3 {
          margin-top: 16px;
          color: #64748b;
        }

        /* History Section */
        .history-section {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-title h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .history-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .tab {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          font-size: 14px;
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

        .history-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid #f1f5f9;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
          color: #64748b;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .campaign-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .campaign-thumb {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .campaign-name {
          display: block;
          font-weight: 600;
          color: #1e293b;
        }

        .campaign-user {
          font-size: 12px;
          color: #94a3b8;
        }

        .category-badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
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

        .btn-view-small {
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: #e2e8f0;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-view-small:hover {
          background: #cbd5e1;
        }

        .empty-history {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }

        /* Modal Styles */
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
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-large {
          max-width: 700px;
        }

        .modal-content h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .detail-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .detail-section {
          margin-bottom: 16px;
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

        .reject-reason {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          margin: 16px 0;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn-cancel, .btn-submit {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-submit {
          background: #ef4444;
          color: white;
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .campaigns-grid {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default FundingApproval;
