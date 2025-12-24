import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS, SUSPEND_USER, ACTIVATE_USER } from '../../graphql/admin';
import { Users, Search, Ban, CheckCircle } from 'lucide-react';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, loading, refetch } = useQuery(GET_ALL_USERS, {
        variables: {
            filter: searchTerm ? { search: searchTerm } : {},
            pagination: { skip: 0, take: 50 }
        }
    });

    const [suspendUser] = useMutation(SUSPEND_USER, {
        onCompleted: () => {
            refetch();
            alert('User berhasil disuspend');
        }
    });

    const [activateUser] = useMutation(ACTIVATE_USER, {
        onCompleted: () => {
            refetch();
            alert('User berhasil diaktifkan');
        }
    });

    const handleSuspend = (user) => {
        const reason = prompt('Alasan suspend:');
        if (reason) {
            suspendUser({ variables: { userId: user.id, reason } });
        }
    };

    const handleActivate = (user) => {
        if (confirm(`Aktifkan kembali user ${user.profile?.fullName}?`)) {
            activateUser({ variables: { userId: user.id } });
        }
    };

    if (loading) return <div>Memuat...</div>;

    const users = data?.getAllUsers?.users || [];

    return (
        <div className="user-management">
            <div className="page-header">
                <h1>Kelola User</h1>
                <p className="page-subtitle">{users.length} users terdaftar</p>
            </div>

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Cari user berdasarkan nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Posisi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            {user.profile?.avatar ? (
                                                <img src={user.profile.avatar} alt="" />
                                            ) : (
                                                <span>{user.profile?.fullName?.charAt(0) || '?'}</span>
                                            )}
                                        </div>
                                        <span className="user-name">{user.profile?.fullName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.profile?.currentPosition || '-'}</td>
                                <td>
                                    <div className="actions">
                                        {user.status === 'ACTIVE' && user.role !== 'SUPER_ADMIN' && (
                                            <button
                                                className="btn-action danger"
                                                onClick={() => handleSuspend(user)}
                                            >
                                                <Ban size={16} />
                                                Suspend
                                            </button>
                                        )}
                                        {user.status === 'SUSPENDED' && (
                                            <button
                                                className="btn-action success"
                                                onClick={() => handleActivate(user)}
                                            >
                                                <CheckCircle size={16} />
                                                Aktifkan
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .user-management {
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
        }

        .search-bar {
          background: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
        }

        .users-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafc;
        }

        th {
          text-align: left;
          padding: 16px 20px;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        td {
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
        }

        .role-badge, .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .role-badge.alumni {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-badge.super_admin {
          background: #fce7f3;
          color: #9f1239;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.suspended {
          background: #fee2e2;
          color: #991b1b;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action.danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-action.danger:hover {
          background: #fecaca;
        }

        .btn-action.success {
          background: #dcfce7;
          color: #166534;
        }

        .btn-action.success:hover {
          background: #bbf7d0;
        }
      `}</style>
        </div>
    );
};

export default UserManagement;
