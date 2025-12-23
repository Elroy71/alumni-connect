import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Building, MapPin } from 'lucide-react';
import { GET_MY_APPLICATIONS } from '../../graphql/job.queries';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const MyApplicationsPage = () => {
  const [filter, setFilter] = useState(null);

  const { data, loading } = useQuery(GET_MY_APPLICATIONS, {
    variables: { status: filter }
  });

  const applications = data?.myApplications || [];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      REVIEWED: 'primary',
      SHORTLISTED: 'secondary',
      INTERVIEW: 'primary',
      OFFERED: 'success',
      ACCEPTED: 'success',
      REJECTED: 'danger'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          My Applications
        </h1>
        <p className="text-dark-600">
          Track status aplikasi pekerjaan Anda
        </p>
      </div>

      {/* Filter */}
      <Card padding="lg">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              !filter
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            All
          </button>
          {['PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Applications */}
      {applications.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-dark-600 mb-6">
            Mulai apply pekerjaan untuk melihat status aplikasi di sini
          </p>
          <Link to="/dashboard/jobs">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Browse Jobs
            </button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} padding="lg" hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {application.job.company?.logo ? (
                      <img
                        src={application.job.company.logo}
                        alt={application.job.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {application.job.company?.name?.charAt(0) || 'J'}
                      </div>
                    )}
                    <div>
                      <Link to={`/dashboard/jobs/${application.job.id}`}>
                        <h3 className="font-bold text-lg text-dark-900 hover:text-primary-600 transition-colors">
                          {application.job.title}
                        </h3>
                      </Link>
                      <p className="text-dark-600">
                        {application.job.company?.name || 'Company'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-dark-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{application.job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;