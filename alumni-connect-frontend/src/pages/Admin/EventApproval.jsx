import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_EVENTS, APPROVE_EVENT, REJECT_EVENT } from '../../graphql/admin';
import { Calendar, MapPin, Clock, User, Check, X, Eye } from 'lucide-react';

const EventApproval = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const { data, loading, refetch } = useQuery(GET_PENDING_EVENTS, {
        variables: { pagination: { skip: 0, take: 20 } }
    });

    const [approveEvent] = useMutation(APPROVE_EVENT, {
        onCompleted: () => {
            refetch();
            alert('Event berhasil disetujui!');
        },
        onError: (error) => alert('Error: ' + error.message)
    });

    const [rejectEvent] = useMutation(REJECT_EVENT, {
        onCompleted: () => {
            refetch();
            setShowRejectModal(false);
            setRejectReason('');
            alert('Event ditolak');
        },
        onError: (error) => alert('Error: ' + error.message)
    });

    const handleApprove = (eventId) => {
        if (confirm('Setujui event ini?')) {
            approveEvent({ variables: { eventId } });
        }
    };

    const handleReject = (event) => {
        setSelectedEvent(event);
        setShowRejectModal(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            alert('Mohon berikan alasan penolakan');
            return;
        }
        rejectEvent({
            variables: {
                eventId: selectedEvent.id,
                reason: rejectReason
            }
        });
    };

    if (loading) return <div className="loading">Memuat...</div>;

    const events = data?.getPendingEvents?.events || [];

    return (
        <div className="event-approval">
            <div className="page-header">
                <h1>Event Approval</h1>
                <p className="page-subtitle">{events.length} event menunggu persetujuan</p>
            </div>

            <div className="events-grid">
                {events.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} strokeWidth={1} />
                        <h3>Tidak ada event pending</h3>
                        <p>Semua event telah direview</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-card">
                            {event.coverImage && (
                                <div className="event-image">
                                    <img src={event.coverImage} alt={event.title} />
                                    <div className="event-badge">PENDING</div>
                                </div>
                            )}

                            <div className="event-content">
                                <h3 className="event-title">{event.title}</h3>

                                <div className="event-meta">
                                    <div className="meta-item">
                                        <User size={16} />
                                        <span>{event.organizer?.profile?.fullName || 'Unknown'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <MapPin size={16} />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={16} />
                                        <span>{new Date(event.startDate).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                <p className="event-description">{event.description}</p>

                                <div className="event-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApprove(event.id)}
                                    >
                                        <Check size={18} />
                                        Setujui
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleReject(event)}
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
                        <h3>Tolak Event</h3>
                        <p>Event: {selectedEvent?.title}</p>
                        <textarea
                            className="reject-reason"
                            placeholder="Alasan penolakan..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setShowRejectModal(false)} className="btn-cancel">
                                Batal
                            </button>
                            <button onClick={submitReject} className="btn-submit">
                                Tolak Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .event-approval {
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

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .event-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
        }

        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .event-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-badge {
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

        .event-content {
          padding: 24px;
        }

        .event-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .event-meta {
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

        .event-description {
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-actions {
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
          transform: scale(1.02);
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover {
          background: #dc2626;
          transform: scale(1.02);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          color: #94a3b8;
        }

        .empty-state h3 {
          margin: 16px 0 8px;
          font-size: 20px;
          color: #64748b;
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

        .modal-content h3 {
          font-size: 24px;
          margin-bottom: 16px;
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

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default EventApproval;
