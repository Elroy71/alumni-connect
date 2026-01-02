import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_CAMPAIGNS, GET_CAMPAIGN_HISTORY } from '../../graphql/funding.queries';
import { APPROVE_CAMPAIGN, REJECT_CAMPAIGN } from '../../graphql/funding.mutations';
import { DollarSign, Check, X, Eye } from 'lucide-react';

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
  'pending_approval': 'Menunggu',
  'active': 'Disetujui',
  'completed': 'Selesai',
  'rejected': 'Ditolak',
  'PENDING_APPROVAL': 'Menunggu',
  'ACTIVE': 'Disetujui',
  'COMPLETED': 'Selesai',
  'REJECTED': 'Ditolak'
};

const FundingApproval = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const handleViewDetail = (campaign) => {
    setSelectedCampaign(campaign);
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

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'completed') return 'status-badge approved';
    if (s === 'rejected') return 'status-badge rejected';
    if (s === 'pending_approval') return 'status-badge pending';
    return 'status-badge';
  };

  // Combine pending and history campaigns
  const pendingCampaigns = pendingData?.pendingCampaigns || [];
  const historyCampaigns = historyData?.campaignHistory || [];

  // All campaigns combined
  const allCampaigns = [...pendingCampaigns, ...historyCampaigns];

  // Filter campaigns based on active filter
  const filteredCampaigns = allCampaigns.filter(campaign => {
    const status = campaign.status?.toLowerCase();
    if (activeFilter === 'all') return true;
    if (activeFilter === 'approved') return status === 'active' || status === 'completed';
    if (activeFilter === 'rejected') return status === 'rejected';
    return true;
  });

  // Count for tabs
  const approvedCount = allCampaigns.filter(c => c.status?.toLowerCase() === 'active' || c.status?.toLowerCase() === 'completed').length;
  const rejectedCount = allCampaigns.filter(c => c.status?.toLowerCase() === 'rejected').length;

  if (loadingPending || loadingHistory) return <div className="loading">Memuat...</div>;

  return (
    <div className="funding-approval">
      <div className="page-header">
        <h1>Funding Approval</h1>
      </div>

      {/* Filter Tabs - Same as Event Approval */}
      <div className="filter-tabs">
        <button
          className={`tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Semua ({allCampaigns.length})
        </button>
        <button
          className={`tab approved ${activeFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveFilter('approved')}
        >
          <Check size={16} />
          Disetujui ({approvedCount})
        </button>
        <button
          className={`tab rejected ${activeFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveFilter('rejected')}
        >
          <X size={16} />
          Ditolak ({rejectedCount})
        </button>
      </div>

      {/* Campaigns Table - Same as Event Approval */}
      <div className="campaigns-table-container">
        {filteredCampaigns.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={64} strokeWidth={1} />
            <h3>Tidak ada campaign</h3>
            <p>Belum ada campaign dalam kategori ini</p>
          </div>
        ) : (
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>CAMPAIGN</th>
                <th>KATEGORI</th>
                <th>TARGET</th>
                <th>STATUS</th>
                <th>TANGGAL</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => {
                const status = campaign.status?.toLowerCase();
                const isPending = status === 'pending_approval';

                return (
                  <tr key={campaign.id}>
                    <td>
                      <div className="campaign-info">
                        {campaign.imageUrl && (
                          <img src={campaign.imageUrl} alt="" className="campaign-thumb" />
                        )}
                        <div>
                          <span className="campaign-name">{campaign.title}</span>
                          <span className="campaign-user">User: {campaign.userId?.slice(-8) || 'Unknown'}</span>
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
                      <span className={getStatusBadgeClass(campaign.status)}>
                        {STATUS_LABELS[campaign.status] || campaign.status}
                      </span>
                    </td>
                    <td>{formatDateTime(campaign.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view-small"
                          onClick={() => handleViewDetail(campaign)}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        {isPending && (
                          <>
                            <button
                              className="btn-approve-small"
                              onClick={() => handleApprove(campaign.id)}
                              disabled={approving}
                              title="Setujui"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="btn-reject-small"
                              onClick={() => handleReject(campaign)}
                              disabled={rejecting}
                              title="Tolak"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

            <div className="detail-section">
              <label>Status:</label>
              <p>
                <span className={getStatusBadgeClass(selectedCampaign.status)}>
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
              <p>{formatAmount(selectedCampaign.currentAmount)}</p>
            </div>

            <div className="detail-section">
              <label>Deskripsi:</label>
              <p className="description-text">{selectedCampaign.description}</p>
            </div>

            {selectedCampaign.status?.toLowerCase() === 'rejected' && selectedCampaign.rejectionReason && (
              <div className="detail-section rejection-section">
                <label>Alasan Penolakan:</label>
                <p className="rejection-reason">{selectedCampaign.rejectionReason}</p>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowDetailModal(false)} className="btn-cancel">Tutup</button>
              {selectedCampaign.status?.toLowerCase() === 'pending_approval' && (
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
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
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

        .campaigns-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .campaigns-table {
          width: 100%;
          border-collapse: collapse;
        }

        .campaigns-table th,
        .campaigns-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #f1f5f9;
        }

        .campaigns-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #64748b;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .campaigns-table tbody tr:hover {
          background: #f8fafc;
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

        .campaign-name {
          display: block;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .campaign-user {
          font-size: 12px;
          color: #94a3b8;
        }

        .category-badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view-small,
        .btn-approve-small,
        .btn-reject-small {
          padding: 8px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-view-small {
          background: #e2e8f0;
          color: #475569;
        }

        .btn-view-small:hover {
          background: #cbd5e1;
        }

        .btn-approve-small {
          background: #10b981;
          color: white;
        }

        .btn-approve-small:hover:not(:disabled) {
          background: #059669;
        }

        .btn-reject-small {
          background: #ef4444;
          color: white;
        }

        .btn-reject-small:hover:not(:disabled) {
          background: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-state h3 {
          margin-top: 16px;
          color: #64748b;
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
          border-radius: 16px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.modal-large {
          max-width: 700px;
        }

        .modal-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .reject-reason {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          margin-top: 12px;
        }

        .reject-reason:focus {
          outline: none;
          border-color: #667eea;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          justify-content: flex-end;
        }

        .btn-cancel,
        .btn-submit,
        .btn-approve,
        .btn-reject {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #e2e8f0;
          color: #475569;
        }

        .btn-cancel:hover {
          background: #cbd5e1;
        }

        .btn-submit {
          background: #ef4444;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-approve {
          background: #10b981;
          color: white;
        }

        .btn-approve:hover:not(:disabled) {
          background: #059669;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover {
          background: #dc2626;
        }

        .detail-image {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .detail-section {
          margin-bottom: 16px;
        }

        .detail-section label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-section p {
          color: #1e293b;
          font-size: 15px;
        }

        .description-text {
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .rejection-section {
          background: #fef2f2;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .rejection-reason {
          color: #991b1b;
        }
      `}</style>
    </div>
  );
};

export default FundingApproval;
