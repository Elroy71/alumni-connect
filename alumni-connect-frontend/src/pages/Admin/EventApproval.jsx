import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_EVENTS, APPROVE_EVENT, REJECT_EVENT, GET_EVENT_HISTORY } from '../../graphql/admin';
import { Calendar, MapPin, Clock, User, Check, X, Eye, History, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_LABELS = {
  'PUBLISHED': 'Disetujui',
  'COMPLETED': 'Selesai',
  'ONGOING': 'Berlangsung',
  'CANCELLED': 'Dibatalkan',
  'DRAFT': 'Draft',
  'REJECTED': 'Ditolak'
};

const TYPE_LABELS = {
  'WEBINAR': 'Webinar',
  'WORKSHOP': 'Workshop',
  'MEETUP': 'Meetup',
  'REUNION': 'Reuni',
  'SEMINAR': 'Seminar',
  'NETWORKING': 'Networking',
  'CONFERENCE': 'Konferensi'
};

const EventApproval = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(true);

  const { data: pendingData, loading: loadingPending, refetch: refetchPending } = useQuery(GET_PENDING_EVENTS, {
    fetchPolicy: 'network-only'
  });

  const { data: historyData, loading: loadingHistory, refetch: refetchHistory } = useQuery(GET_EVENT_HISTORY, {
    fetchPolicy: 'network-only'
  });

  const [approveEvent] = useMutation(APPROVE_EVENT, {
    onCompleted: () => {
      refetchPending();
      refetchHistory();
      alert('Event berhasil disetujui!');
    },
    onError: (error) => alert('Error: ' + error.message)
  });

  const [rejectEvent] = useMutation(REJECT_EVENT, {
    onCompleted: () => {
      refetchPending();
      refetchHistory();
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

  const handleViewDetail = (event, isHistory = false) => {
    setSelectedEvent({ ...event, isHistory });
    setShowDetailModal(true);
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

  // Get all events from both queries and combine
  const allEventsFromPending = pendingData?.events?.events || [];
  const allEventsFromHistory = historyData?.events?.events || [];

  // Combine and deduplicate by ID
  const allEventsMap = new Map();
  [...allEventsFromPending, ...allEventsFromHistory].forEach(e => {
    if (!allEventsMap.has(e.id)) {
      allEventsMap.set(e.id, e);
    }
  });
  const allEvents = Array.from(allEventsMap.values());

  // Filter pending events (PENDING_APPROVAL only)
  const pendingEvents = allEvents.filter(e => e.status === 'PENDING_APPROVAL');

  // Filter history events (exclude pending and draft)
  const historyEvents = allEvents.filter(e =>
    e.status !== 'PENDING_APPROVAL' && e.status !== 'DRAFT'
  );

  const filteredHistory = historyEvents.filter(event => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'approved') return event.status === 'PUBLISHED' || event.status === 'ONGOING' || event.status === 'COMPLETED';
    if (historyFilter === 'cancelled') return event.status === 'CANCELLED' || event.status === 'REJECTED';
    return true;
  });

  const approvedCount = historyEvents.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING' || e.status === 'COMPLETED').length;
  const cancelledCount = historyEvents.filter(e => e.status === 'CANCELLED' || e.status === 'REJECTED').length;

  if (loadingPending) return <div className="loading">Memuat...</div>;

  return (
    <div className="event-approval">
      {/* Pending Events Section */}
      <div className="page-header">
        <h1>Event Approval</h1>
        <p className="page-subtitle">{pendingEvents.length} event menunggu persetujuan</p>
      </div>

      <div className="events-grid">
        {pendingEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} strokeWidth={1} />
            <h3>Tidak ada event pending</h3>
            <p>Semua event telah direview</p>
          </div>
        ) : (
          pendingEvents.map((event) => (
            <div key={event.id} className="event-card">
              {event.coverImage && (
                <div className="event-image">
                  <img src={event.coverImage} alt={event.title} />
                  <div className="event-badge">PENDING</div>
                </div>
              )}

              <div className="event-content">
                <div className="event-type">
                  {TYPE_LABELS[event.type] || event.type}
                </div>
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
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-actions">
                  <button
                    className="btn-view"
                    onClick={() => handleViewDetail(event, false)}
                  >
                    <Eye size={18} />
                    Detail
                  </button>
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

      {/* History Section */}
      <div className="history-section">
        <div className="history-header" onClick={() => setShowHistory(!showHistory)}>
          <div className="history-title">
            <History size={24} />
            <h2>Riwayat Event</h2>
            <span className="history-count">({historyEvents.length})</span>
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
                Semua ({historyEvents.length})
              </button>
              <button
                className={`tab approved ${historyFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('approved')}
              >
                <Check size={16} />
                Disetujui ({approvedCount})
              </button>
              <button
                className={`tab cancelled ${historyFilter === 'cancelled' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('cancelled')}
              >
                <X size={16} />
                Dibatalkan ({cancelledCount})
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
                      <th>Event</th>
                      <th>Tipe</th>
                      <th>Lokasi</th>
                      <th>Status</th>
                      <th>Tanggal Event</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <div className="event-info">
                            {event.coverImage && (
                              <img src={event.coverImage} alt="" className="event-thumb" />
                            )}
                            <div>
                              <span className="event-name">{event.title}</span>
                              <span className="event-organizer">
                                {event.organizer?.profile?.fullName || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="type-badge">
                            {TYPE_LABELS[event.type] || event.type}
                          </span>
                        </td>
                        <td>{event.location}</td>
                        <td>
                          <span className={`status-badge ${event.status?.toLowerCase()}`}>
                            {STATUS_LABELS[event.status] || event.status}
                          </span>
                        </td>
                        <td>{formatDateTime(event.startDate)}</td>
                        <td>
                          <button
                            className="btn-view-small"
                            onClick={() => handleViewDetail(event, true)}
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

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>Detail Event</h3>

            {selectedEvent.coverImage && (
              <img
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="detail-image"
              />
            )}

            <div className="detail-section">
              <label>Judul:</label>
              <p>{selectedEvent.title}</p>
            </div>

            {selectedEvent.isHistory && (
              <div className="detail-section">
                <label>Status:</label>
                <p>
                  <span className={`status-badge ${selectedEvent.status?.toLowerCase()}`}>
                    {STATUS_LABELS[selectedEvent.status] || selectedEvent.status}
                  </span>
                </p>
              </div>
            )}

            <div className="detail-section">
              <label>Tipe:</label>
              <p>{TYPE_LABELS[selectedEvent.type] || selectedEvent.type}</p>
            </div>

            <div className="detail-section">
              <label>Lokasi:</label>
              <p>{selectedEvent.location} {selectedEvent.isOnline && '(Online)'}</p>
            </div>

            <div className="detail-section">
              <label>Tanggal:</label>
              <p>{formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}</p>
            </div>

            <div className="detail-section">
              <label>Organizer:</label>
              <p>{selectedEvent.organizer?.profile?.fullName || 'Unknown'}</p>
            </div>

            <div className="detail-section">
              <label>Deskripsi:</label>
              <p className="description-text">{selectedEvent.description}</p>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDetailModal(false)} className="btn-cancel">Tutup</button>
              {!selectedEvent.isHistory && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleApprove(selectedEvent.id);
                    }}
                    className="btn-approve"
                  >
                    <Check size={18} />
                    Setujui
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedEvent);
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
        .event-approval {
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

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
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

        .event-type {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
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
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
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
          background: #8b5cf6;
          color: white;
        }

        .tab.approved.active {
          background: #10b981;
        }

        .tab.cancelled.active {
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

        .event-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .event-thumb {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .event-name {
          display: block;
          font-weight: 600;
          color: #1e293b;
        }

        .event-organizer {
          font-size: 12px;
          color: #94a3b8;
        }

        .type-badge {
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

        .status-badge.published, .status-badge.ongoing, .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.cancelled, .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
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

        @media (max-width: 768px) {
          .events-grid {
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

export default EventApproval;
