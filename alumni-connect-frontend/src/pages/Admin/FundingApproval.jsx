import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_CAMPAIGNS, APPROVE_CAMPAIGN, REJECT_CAMPAIGN } from '../../graphql/admin';
import { DollarSign, User, Calendar, Target, Check, X } from 'lucide-react';

const FundingApproval = () => {
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const { data, loading, refetch } = useQuery(GET_PENDING_CAMPAIGNS, {
        variables: { pagination: { skip: 0, take: 20 } }
    });

    const [approveCampaign] = useMutation(APPROVE_CAMPAIGN, {
        onCompleted: () => {
            refetch();
            alert('Campaign berhasil disetujui!');
        }
    });

    const [rejectCampaign] = useMutation(REJECT_CAMPAIGN, {
        onCompleted: () => {
            refetch();
            setShowRejectModal(false);
            setRejectReason('');
            alert('Campaign ditolak');
        }
    });

    const handleApprove = (campaignId) => {
        if (confirm('Setujui campaign ini?')) {
            approveCampaign({ variables: { campaignId } });
        }
    };

    const handleReject = (campaign) => {
        setSelectedCampaign(campaign);
        setShowRejectModal(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            alert('Mohon berikan alasan penolakan');
            return;
        }
        rejectCampaign({
            variables: {
                campaignId: selectedCampaign.id,
                reason: rejectReason
            }
        });
    };

    if (loading) return <div>Memuat...</div>;

    const campaigns = data?.getPendingCampaigns?.campaigns || [];

    return (
        <div className="funding-approval">
            <div className="page-header">
                <h1>Funding Approval</h1>
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
                            {campaign.coverImage && (
                                <div className="campaign-image">
                                    <img src={campaign.coverImage} alt={campaign.title} />
                                    <div className="campaign-badge">PENDING</div>
                                </div>
                            )}

                            <div className="campaign-content">
                                <div className="campaign-category">{campaign.category}</div>
                                <h3 className="campaign-title">{campaign.title}</h3>

                                <div className="campaign-meta">
                                    <div className="meta-item">
                                        <User size={16} />
                                        <span>{campaign.creator?.profile?.fullName || 'Unknown'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Target size={16} />
                                        <span>Target: Rp {campaign.goalAmount?.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={16} />
                                        <span>Deadline: {new Date(campaign.endDate).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                <p className="campaign-description">{campaign.description}</p>

                                <div className="campaign-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApprove(campaign.id)}
                                    >
                                        <Check size={18} />
                                        Setujui
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleReject(campaign)}
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

            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Tolak Campaign</h3>
                        <p>Campaign: {selectedCampaign?.title}</p>
                        <textarea
                            className="reject-reason"
                            placeholder="Alasan penolakan..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setShowRejectModal(false)} className="btn-cancel">Batal</button>
                            <button onClick={submitReject} className="btn-submit">Tolak Campaign</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .funding-approval {
          max-width: 1400px;
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

        .btn-approve, .btn-reject {
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

        .btn-approve {
          background: #10b981;
          color: white;
        }

        .btn-approve:hover {
          background: #059669;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover {
          background: #dc2626;
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
      `}</style>
        </div>
    );
};

export default FundingApproval;
