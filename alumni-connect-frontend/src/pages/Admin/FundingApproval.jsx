import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_CAMPAIGNS } from '../../graphql/funding.queries';
import { APPROVE_CAMPAIGN, REJECT_CAMPAIGN } from '../../graphql/funding.mutations';
import { DollarSign, User, Calendar, Target, Check, X, Eye } from 'lucide-react';

// Category display mapping
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

const FundingApproval = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, loading, refetch } = useQuery(GET_PENDING_CAMPAIGNS);

  const [approveCampaign, { loading: approving }] = useMutation(APPROVE_CAMPAIGN, {
    onCompleted: () => {
      refetch();
      alert('Campaign berhasil disetujui!');
    },
    onError: (error) => {
      alert('Gagal menyetujui campaign: ' + error.message);
    }
  });

  const [rejectCampaign, { loading: rejecting }] = useMutation(REJECT_CAMPAIGN, {
    onCompleted: () => {
      refetch();
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) return <div className="loading">Memuat...</div>;

  const campaigns = data?.pendingCampaigns || [];

  return (
    <div className="funding-approval">
      <div className="page-header">
        <h1>Persetujuan Funding</h1>
        <p className="page-subtitle">{campaigns.length} campaign menunggu persetujuan</p>
      </div>

      <div className="campaigns-grid">
        {campaigns.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={64} strokeWidth={1} />
            <h3>Tidak ada campaign pending</h3>
            <p>Semua campaign telah direview</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
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
                    onClick={() => handleViewDetail(campaign)}
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

            <div className="modal-actions">
              <button onClick={() => setShowDetailModal(false)} className="btn-cancel">Tutup</button>
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

        .btn-reject:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          color: #94a3b8;
        }

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
      `}</style>
    </div>
  );
};

export default FundingApproval;
