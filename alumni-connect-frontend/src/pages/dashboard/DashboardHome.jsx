import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Briefcase,
  Calendar,
  Heart,
  TrendingUp,
  Users,
  Eye,
  Plus
} from 'lucide-react';
import { GET_MY_POSTS } from '../../graphql/forum.queries';
import { GET_MY_APPLICATIONS } from '../../graphql/job.queries';
import { GET_MY_REGISTRATIONS } from '../../graphql/event.queries';
import { GET_MY_DONATIONS } from '../../graphql/funding.queries';
import Card from '../../components/ui/Card';
import useAuthStore from '../../features/auth/store/authStore';

const DashboardHome = () => {
  const { user } = useAuthStore();

  const { data: postsData } = useQuery(GET_MY_POSTS);
  const { data: applicationsData } = useQuery(GET_MY_APPLICATIONS);
  const { data: eventsData } = useQuery(GET_MY_REGISTRATIONS, {
    variables: { upcoming: true }
  });
  const { data: donationsData } = useQuery(GET_MY_DONATIONS);

  const myPosts = postsData?.myPosts || [];
  const myApplications = applicationsData?.myApplications || [];
  const myEvents = eventsData?.myRegistrations || [];
  const myDonations = donationsData?.myDonations || [];

  const totalDonated = myDonations
    .filter(d => d.status === 'VERIFIED')
    .reduce((sum, d) => sum + d.amount, 0);

  const stats = [
    {
      title: 'Postingan Forum',
      value: myPosts.length,
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/dashboard/forum'
    },
    {
      title: 'Lamaran Kerja',
      value: myApplications.length,
      icon: <Briefcase className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/dashboard/my-applications'
    },
    {
      title: 'Registrasi Event',
      value: myEvents.length,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/dashboard/my-events'
    },
    {
      title: 'Total Donasi',
      value: `Rp ${(totalDonated / 1000).toFixed(0)}K`,
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-red-500',
      link: '/dashboard/my-donations'
    }
  ];

  const quickActions = [
    {
      title: 'Buat Postingan',
      description: 'Bagikan sesuatu dengan alumni',
      icon: <MessageCircle className="w-6 h-6" />,
      link: '/dashboard/forum/create',
      color: 'bg-blue-500'
    },
    {
      title: 'Pasang Lowongan',
      description: 'Bagikan peluang kerja',
      icon: <Briefcase className="w-6 h-6" />,
      link: '/dashboard/jobs/create',
      color: 'bg-purple-500'
    },
    {
      title: 'Buat Event',
      description: 'Selenggarakan acara alumni',
      icon: <Calendar className="w-6 h-6" />,
      link: '/dashboard/events/create',
      color: 'bg-green-500'
    },
    {
      title: 'Mulai Kampanye',
      description: 'Galang dana untuk tujuan baik',
      icon: <Heart className="w-6 h-6" />,
      link: '/dashboard/funding/create',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="font-display font-bold text-3xl mb-2">
          Selamat datang kembali, {user?.profile?.fullName || 'Alumni'}! 👋
        </h1>
        <p className="text-primary-100">
          Berikut aktivitas terbaru di jaringan alumni Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card hover padding="lg" className="transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card hover padding="lg" className="h-full transition-transform hover:scale-105">
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-lg text-dark-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-dark-600 text-sm">
                  {action.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-dark-900">Postingan Terbaru</h3>
            <Link to="/dashboard/forum" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
              Lihat Semua →
            </Link>
          </div>
          {myPosts.length === 0 ? (
            <div className="text-center py-8 text-dark-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada postingan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/dashboard/forum/post/${post.id}`}>
                  <div className="p-3 bg-dark-50 rounded-lg hover:bg-dark-100 transition-colors">
                    <p className="font-semibold text-dark-900 line-clamp-1 mb-1">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post._count?.comments || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Events */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-dark-900">Event Mendatang</h3>
            <Link to="/dashboard/my-events" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
              Lihat Semua →
            </Link>
          </div>
          {myEvents.length === 0 ? (
            <div className="text-center py-8 text-dark-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada event mendatang</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.slice(0, 3).map((registration) => (
                <Link key={registration.id} to={`/dashboard/events/${registration.event.id}`}>
                  <div className="p-3 bg-dark-50 rounded-lg hover:bg-dark-100 transition-colors">
                    <p className="font-semibold text-dark-900 line-clamp-1 mb-1">
                      {registration.event.title}
                    </p>
                    <p className="text-xs text-dark-500">
                      {new Date(registration.event.startDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;